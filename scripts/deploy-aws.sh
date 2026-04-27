#!/bin/bash
# ============================================================
# AWS ECS Deployment Script for NovatechStore
# ============================================================
# Prerequisites:
#   - AWS CLI configured (aws configure)
#   - Docker installed
#   - Existing ECS cluster and RDS instance
# ============================================================

set -e

# ===== CONFIG (edit these) =====
AWS_REGION="us-east-1"
AWS_ACCOUNT_ID="123456789012"          # Replace with your AWS Account ID
ECR_REPO="novatech-store"
ECS_CLUSTER="novatech-cluster"
ECS_SERVICE="novatech-service"
ECS_TASK_FAMILY="novatech-task"
IMAGE_TAG=$(git rev-parse --short HEAD 2>/dev/null || echo "latest")
# ================================

ECR_URI="${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_REPO}"

echo "=========================================="
echo "Deploying NovatechStore to AWS ECS"
echo "  Image: ${ECR_URI}:${IMAGE_TAG}"
echo "  Cluster: ${ECS_CLUSTER}"
echo "  Service: ${ECS_SERVICE}"
echo "=========================================="

# 1. Login to ECR
echo ""
echo "[1/5] Authenticating with ECR..."
aws ecr get-login-password --region $AWS_REGION | \
  docker login --username AWS --password-stdin \
  "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"

# 2. Build Docker image
echo ""
echo "[2/5] Building Docker image..."
docker build -t ${ECR_REPO}:${IMAGE_TAG} .
docker tag ${ECR_REPO}:${IMAGE_TAG} ${ECR_URI}:${IMAGE_TAG}
docker tag ${ECR_REPO}:${IMAGE_TAG} ${ECR_URI}:latest

# 3. Push to ECR
echo ""
echo "[3/5] Pushing to ECR..."
docker push ${ECR_URI}:${IMAGE_TAG}
docker push ${ECR_URI}:latest

# 4. Update ECS task definition
echo ""
echo "[4/5] Registering new task definition..."
TASK_DEF=$(aws ecs describe-task-definition \
  --task-definition $ECS_TASK_FAMILY \
  --region $AWS_REGION \
  --query 'taskDefinition' \
  --output json)

NEW_TASK_DEF=$(echo $TASK_DEF | python3 -c "
import json, sys
td = json.load(sys.stdin)
td['containerDefinitions'][0]['image'] = '${ECR_URI}:${IMAGE_TAG}'
for key in ['taskDefinitionArn','revision','status','requiresAttributes','compatibilities','registeredAt','registeredBy']:
    td.pop(key, None)
print(json.dumps(td))
")

NEW_REVISION=$(aws ecs register-task-definition \
  --region $AWS_REGION \
  --cli-input-json "$NEW_TASK_DEF" \
  --query 'taskDefinition.revision' \
  --output text)

echo "  New revision: ${ECS_TASK_FAMILY}:${NEW_REVISION}"

# 5. Update ECS service
echo ""
echo "[5/5] Updating ECS service..."
aws ecs update-service \
  --region $AWS_REGION \
  --cluster $ECS_CLUSTER \
  --service $ECS_SERVICE \
  --task-definition "${ECS_TASK_FAMILY}:${NEW_REVISION}" \
  --force-new-deployment \
  --output text \
  --query 'service.serviceName'

echo ""
echo "=========================================="
echo "Deployment initiated!"
echo "Monitor: https://console.aws.amazon.com/ecs/home?region=${AWS_REGION}#/clusters/${ECS_CLUSTER}/services/${ECS_SERVICE}/events"
echo "=========================================="
