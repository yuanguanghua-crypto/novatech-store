# 0003: Dual-Path Checkout — Auto Order + Quote

**Date**: 2026-06-05

**Status**: Accepted

## Context

Laboratory glassware purchases range from single-item replacement orders by individual researchers to large institutional procurement by universities. These two customer types have fundamentally different needs:

- Individual researchers: small quantity (1-5), US address, want to pay by credit card and receive the item immediately
- Institutional/International: larger quantities, may need net terms, require shipping cost estimates, packaging specifications, and lead time confirmation

## Decision

Implement a dual-path checkout system:

**Path A — Auto Checkout** (small orders, US address):
- ≤5 items per SKU, US shipping address
- Packaging cost is pre-calculated (standard foam wrap + box)
- Shipping cost is pre-calculated (USPS/UPS rates by weight)
- Customer completes payment (Stripe) and order is placed automatically
- No human intervention required

**Path B — Quote Flow** (large or international orders):
- ≥6 items per SKU, or any international address, or custom requests
- Customer submits a quote request with address and quantity
- Sales team reviews and calculates packaging + shipping costs
- Final quote is sent to customer with a link to accept and proceed to payment
- Quote is valid for 30 days

## Rationale

- Pure auto-checkout cannot handle glassware's non-linear packaging costs for bulk orders
- Pure quote-only flow would lose small customers who want immediate purchase
- The existing Quote system is already well-developed and can be reused for Path B
- Threshold of ≤5 items is conservative and covers the vast majority of individual researcher orders

## Consequences

- Auto checkout path requires: Stripe integration, automatic packaging cost calculation, shipping rate API
- Quote path already exists but needs: shipping estimate display, address-aware packaging calculation
- The system must distinguish between "add to cart" (Path A) and "request quote" (Path B) at the product detail level
- Order fulfillment workflow must handle both paths differently
