# Review: Import Glassware & Scaffold Data Model

## Checklist

- [x] **Proposal** — scope clear, domains defined, in/out of scope listed
- [x] **Decisions confirmed** — Supplier="ENB", delete old Product table, initial stock=500/500
- [x] **Specs** — 4 domains, 12 scenarios, all edge cases covered
- [x] **Design** — 4-phase plan, schema changes, import script architecture, frontend migration approach
- [x] **Rollback plan** — defined
- [x] **Dual-warehouse impact** — accounted for (stock fields, defaults)

## Items Requiring Approval

1. **CategoryGroup model**: Adding a new model for category page metadata — approved?
2. **OrderItem.productId**: Currently references old `prisma.product` → should reference `ERPSKU.erpSku` instead
3. **4-phase execution order**: Schema → Import → Frontend → Cleanup — does this sequence work for you?

## Review Result

**Status**: Approved (waiting for your confirmation)
