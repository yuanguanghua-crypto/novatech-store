#!/usr/bin/env python3
"""Import v32_sku_104_fixed.xlsx into SQLite database (V3.2 schema)."""
import sqlite3, openpyxl, os, re, uuid, sys
from pathlib import Path

DB_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DB_PATH = os.path.join(DB_DIR, 'prisma', 'dev.db')
EXCEL_PATH = '/Volumes/PC E/玻璃仪器数据/v32_sku_104_fixed.xlsx'

CATEGORY_MAP = {
    'Griffin Beaker':      ('Beakers', 'beakers'),
    'Tall Beaker':         ('Beakers', 'beakers'),
    'Erlenmeyer Flask':    ('Flasks', 'flasks'),
    'Round Bottom Flask':  ('Flasks', 'flasks'),
    'Volumetric Flask':    ('Flasks', 'flasks'),
    'Filtering Flask':     ('Flasks', 'flasks'),
    'Media Bottle':        ('Bottles & Jars', 'bottles-jars'),
    'Graduated Cylinder':  ('Cylinders', 'cylinders'),
    'Allihn Condenser':    ('Condensers', 'condensers'),
    'Liebig Condenser':    ('Condensers', 'condensers'),
    'Buchner Funnel':      ('Funnels', 'funnels'),
    'Glass Funnel':        ('Funnels', 'funnels'),
    'Adapter':             ('Adapters & Connectors', 'adapters-connectors'),
    'Burette':             ('Analytical', 'analytical'),
    'Volumetric Pipette':  ('Analytical', 'analytical'),
    'Distillation Kit':    ('Distillation Kits', 'distillation-kits'),
    'Vacuum Filtration Kit': ('Filtration Kits', 'filtration-kits'),
    'Organic Synthesis Kit': ('Synthetic & Reaction', 'synthetic-reaction'),
}

def make_slug(text):
    s = text.lower().replace(' ', '-')
    s = re.sub(r'[^a-z0-9-]', '', s)
    s = re.sub(r'-+', '-', s)
    return s.strip('-')

def gen_id():
    return uuid.uuid4().hex[:24]

# ─── Create DB ──────────────────────────────────────────────────────
if os.path.exists(DB_PATH):
    os.remove(DB_PATH)
conn = sqlite3.connect(DB_PATH)
conn.execute("PRAGMA journal_mode=WAL")
c = conn.cursor()

print("Creating schema...")

# CategoryGroup
c.execute('''CREATE TABLE IF NOT EXISTS category_group (
    id TEXT PRIMARY KEY, name TEXT UNIQUE NOT NULL, slug TEXT UNIQUE NOT NULL,
    description TEXT, sort_order INTEGER DEFAULT 0, is_active INTEGER DEFAULT 1,
    created_at TEXT DEFAULT (datetime('now')), updated_at TEXT DEFAULT (datetime('now'))
)''')

# SupplierMaster
c.execute('''CREATE TABLE IF NOT EXISTS supplier_master (
    supplier_id TEXT PRIMARY KEY, supplier_name TEXT NOT NULL,
    country TEXT NOT NULL DEFAULT 'CN', lead_time_days INTEGER DEFAULT 30,
    rating REAL DEFAULT 0.0, is_active INTEGER DEFAULT 1,
    created_at TEXT DEFAULT (datetime('now')), updated_at TEXT DEFAULT (datetime('now'))
)''')

# SPU
c.execute('''CREATE TABLE IF NOT EXISTS spu (
    spu_id TEXT PRIMARY KEY, product_family_name TEXT NOT NULL,
    category_l1 TEXT NOT NULL, category_group_id TEXT, seo_title TEXT,
    slug TEXT UNIQUE, metadata TEXT DEFAULT '{}', is_active INTEGER DEFAULT 1,
    created_at TEXT DEFAULT (datetime('now')), updated_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (category_group_id) REFERENCES category_group(id)
)''')

# ProductVariant
c.execute('''CREATE TABLE IF NOT EXISTS variant (
    variant_id TEXT PRIMARY KEY, spu_id TEXT NOT NULL,
    variant_name TEXT NOT NULL, volume_ml INTEGER, length_mm INTEGER,
    joint_type TEXT, joint_size TEXT, wall_type TEXT, material_family TEXT,
    color TEXT, accuracy_class TEXT, selling_price_usd REAL NOT NULL,
    cost_price_usd REAL NOT NULL, gross_margin_pct REAL, weight_grams INTEGER,
    slug TEXT UNIQUE, is_active INTEGER DEFAULT 1,
    created_at TEXT DEFAULT (datetime('now')), updated_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (spu_id) REFERENCES spu(spu_id)
)''')

# ERPSKU
c.execute('''CREATE TABLE IF NOT EXISTS erp_sku (
    erp_sku TEXT PRIMARY KEY, variant_id TEXT NOT NULL, business_sku TEXT NOT NULL,
    initial_stock_qty INTEGER DEFAULT 0, low_stock_alert_qty INTEGER DEFAULT 0,
    stock_houston INTEGER DEFAULT 500, stock_china INTEGER DEFAULT 500,
    low_stock_alert_houston INTEGER DEFAULT 100, low_stock_alert_china INTEGER DEFAULT 100,
    is_active INTEGER DEFAULT 1, created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (variant_id) REFERENCES variant(variant_id)
)''')

# VariantSupplierMap
c.execute('''CREATE TABLE IF NOT EXISTS variant_supplier_map (
    variant_id TEXT NOT NULL, supplier_id TEXT NOT NULL,
    supplier_sku TEXT, unit_cost_usd REAL, moq INTEGER DEFAULT 100,
    lead_time_days INTEGER DEFAULT 25, is_preferred INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now')), updated_at TEXT DEFAULT (datetime('now')),
    PRIMARY KEY (variant_id, supplier_id),
    FOREIGN KEY (variant_id) REFERENCES variant(variant_id),
    FOREIGN KEY (supplier_id) REFERENCES supplier_master(supplier_id)
)''')

conn.commit()

# ─── Read Excel ────────────────────────────────────────────────────
wb = openpyxl.load_workbook(EXCEL_PATH, data_only=True)
ws = wb.active
headers = [cell.value for cell in ws[1]]
rows = []
for row in ws.iter_rows(min_row=2, values_only=True):
    rows.append(dict(zip(headers, row)))
print(f"Read {len(rows)} rows from Excel")

# ─── Clean ───────────────────────────────────────────────────────────
none_count = margin_count = 0
for r in rows:
    for f in ['Joint_Type', 'Joint_Size']:
        if r.get(f) == 'None': r[f] = None; none_count += 1
    if isinstance(r.get('Gross_Margin'), (int, float)):
        r['Gross_Margin'] = round(r['Gross_Margin'] * 100, 2); margin_count += 1
print(f"Cleaned: {none_count} None→NULL, {margin_count} margins×100")

# ─── Group by SPU ───────────────────────────────────────────────────
spu_map = {}
for r in rows:
    sid = r['SPU_ID']
    if sid not in spu_map:
        ci = CATEGORY_MAP.get(r['Product_Family'], ('Other', 'other'))
        spu_map[sid] = {'spu_id': sid, 'product_family_name': r['Product_Family'],
                        'category_l1': ci[0], 'category_slug': ci[1],
                        'seo_title': r['SEO_Product_Name'], 'variants': []}
    spu_map[sid]['variants'].append(r)
spu_list = list(spu_map.values())
print(f"Grouped into {len(spu_list)} SPUs")

# ─── 1. SupplierMaster ──────────────────────────────────────────────
c.execute('INSERT OR IGNORE INTO supplier_master VALUES (?,?,?,?,?,?,datetime("now"),datetime("now"))',
          ('ENB', 'ENB', 'CN', 30, 0.0, 1))
print("✓ SupplierMaster: ENB")

# ─── 2. CategoryGroups ──────────────────────────────────────────────
seen = set()
for spu in spu_list:
    if spu['category_slug'] not in seen:
        seen.add(spu['category_slug'])
        c.execute('INSERT OR IGNORE INTO category_group (id, name, slug, sort_order) VALUES (?,?,?,?)',
                  (gen_id(), spu['category_l1'], spu['category_slug'], len(seen)))
print(f"✓ CategoryGroups: {len(seen)}")

c.execute('SELECT id, slug FROM category_group')
cid_map = {row[1]: row[0] for row in c.fetchall()}

# ─── 3. SPUs ─────────────────────────────────────────────────────────
for spu in spu_list:
    c.execute('INSERT OR IGNORE INTO spu (spu_id, product_family_name, category_l1, category_group_id, seo_title, slug) VALUES (?,?,?,?,?,?)',
              (spu['spu_id'], spu['product_family_name'], spu['category_l1'],
               cid_map.get(spu['category_slug']), spu['seo_title'],
               make_slug(spu['product_family_name'])))
print(f"✓ SPUs: {len(spu_list)}")

# ─── 4. Variants + SKUs + Maps ──────────────────────────────────────
vc = sc = 0
for spu in spu_list:
    for r in spu['variants']:
        c.execute('''INSERT OR IGNORE INTO variant VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,datetime("now"),datetime("now"))''',
                  (r['Variant_ID'], spu['spu_id'], (r['SEO_Product_Name'] or '')[:200],
                   r.get('Volume_ml'), r.get('Length_mm'),
                   r.get('Joint_Type'), r.get('Joint_Size'),
                   r.get('Wall_Type'), r.get('Material_Family'),
                   r.get('Color'), r.get('Accuracy_Class'),
                   float(r.get('Selling_Price_USD',0) or 0),
                   float(r.get('Cost_Price_USD',0) or 0),
                   r.get('Gross_Margin'), None,
                   make_slug(f"{r['Product_Family']}-{r.get('Volume_ml') or ''}ml"),
                   1))
        vc += 1
        
        c.execute('''INSERT OR IGNORE INTO erp_sku VALUES (?,?,?,?,?,?,?,?,?,?,?,datetime("now"),datetime("now"))''',
                  (r['ERP_SKU'], r['Variant_ID'], r['Business_SKU'],
                   int(r.get('Initial_Stock',0) or 0), int(r.get('Low_Stock_Alert',0) or 0),
                   500, 500, 100, 100, 1))
        sc += 1
        
        c.execute('INSERT OR IGNORE INTO variant_supplier_map VALUES (?,?,?,?,?,?,?,datetime("now"),datetime("now"))',
                  (r['Variant_ID'], 'ENB', None, float(r.get('Cost_Price_USD',0) or 0), 100, 25, 1))

conn.commit()
conn.close()

print(f"✓ ProductVariants: {vc}")
print(f"✓ ERPSKUs: {sc}")
print(f"✓ VariantSupplierMaps: {sc}")
print(f"\n{'='*50}")
print(f"✓ IMPORT COMPLETE!")
print(f"  Database: {DB_PATH}")
print(f"  1 SupplierMaster, {len(seen)} Categories")
print(f"  {len(spu_list)} SPUs, {vc} Variants, {sc} SKUs")
print(f"{'='*50}")
