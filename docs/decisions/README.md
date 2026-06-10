# Architecture Decision Records

This directory contains Architecture Decision Records (ADRs) for the Novatech Labware Store project.

## What is an ADR?

An Architecture Decision Record is a short document that captures an important architectural decision made during the project lifecycle, including the context, the decision itself, and the rationale.

## How to write an ADR

Each ADR is a Markdown file named `NNNN-title-with-dashes.md`, where `NNNN` is a sequential number (0000, 0001, 0002...).

### Template

```markdown
# NNNN: Title of Decision

**Date**: YYYY-MM-DD

**Status**: Proposed | Accepted | Deprecated | Superseded by NNNN

## Context

What is the context behind this decision? What problem are we solving?

## Decision

What is the decision we are making?

## Rationale

Why is this the right decision? What alternatives were considered?

## Consequences

What are the implications of this decision? What changes need to be made?
```

## ADR Index

- ADR-0000: Use V3.2 PIM/MDM as Primary Data Model
- ADR-0001: Discard Old Novatech Product Data
- ADR-0002: Dual-Warehouse Inventory Model
- ADR-0003: Quote + Auto Checkout Dual Path
