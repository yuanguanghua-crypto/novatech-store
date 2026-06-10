# 0002: Dual-Warehouse Inventory Model

**Date**: 2026-06-05

**Status**: Accepted

## Context

Products are manufactured in China and stored in two locations:
- A distribution warehouse in Houston, TX (for US customers)
- The factory warehouse in China (for international customers and US replenishment)

Glassware packaging costs vary significantly by quantity and destination, making shipping cost non-linear. The system needs to know which warehouse has stock and from which warehouse to ship.

## Decision

Implement a dual-warehouse inventory model with two stock fields on `ERPSKU`:

- `stockHouston`: Inventory available in the US warehouse
- `stockChina`: Inventory available in the China warehouse

Shipping logic:
- US shipping address → ship from Houston
- Non-US address → ship from China
- If Houston stock is insufficient for a US order, the system notifies the customer of lead time for China shipment

## Rationale

- Two locations with distinct stock levels is a fixed operational reality, not a transient state
- Separate fields allow per-warehouse low-stock alerts and replenishment triggers
- Enables accurate delivery time estimation per customer location
- Avoids a complex multi-warehouse abstraction that isn't needed (there will never be more than 2-3 warehouses)

## Consequences

- `ERPSKU` schema must be extended with stock fields
- Product display must show warehouse-specific availability
- Order processing must know the customer's region to determine ship-from location
- Quote generation must factor in ship-from location for packaging and freight costs
