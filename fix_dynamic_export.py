#!/usr/bin/env python3
"""Fix broken 'export const dynamic' placement in API route files.

The previous script incorrectly concatenated:
    export async function GET(...) {
    export const dynamic = 'force-dynamic'

This puts TWO 'export' keywords consecutively, which is a syntax error.
We need to move 'export const dynamic' AFTER the function's closing brace.
"""

import re
import os
from pathlib import Path

API_DIR = Path("E:/novatech-store/app/api")

# Pattern 1: export const dynamic inside a function (consecutive with the function declaration line)
# e.g.
#   export async function GET(request: NextRequest) {
#   export const dynamic = 'force-dynamic'
#     try {
REOPEN_EXPORT = re.compile(
    r'export\s+(async\s+)?function\s+\w+\([^)]*\)\s*\{[^{]*?\n\s*export\s+const\s+dynamic\s*=\s*[^\n]+\n',
    re.MULTILINE
)
# Pattern 2: standalone orphan export const dynamic (inside function body)
REORPHAN_EXPORT = re.compile(
    r'(\n\s*try\s*\{[^{]*?)(export\s+const\s+dynamic\s*=\s*[^\n]+\n)',
    re.DOTALL
)

fixed_count = 0
for route_file in API_DIR.rglob("route.ts"):
    try:
        content = route_file.read_text(encoding="utf-8")
    except Exception as e:
        print(f"Error reading {route_file}: {e}")
        continue

    original = content

    # Find and fix the broken pattern
    # We look for: function declaration line immediately followed by 'export const dynamic'
    lines = content.split('\n')
    new_lines = []
    i = 0
    changed = False
    while i < len(lines):
        line = lines[i]
        # Check if current line looks like: export async function GET(...) {  OR  export function GET(...) {
        func_match = re.match(r'^(\s*)export\s+(async\s+)?function\s+\w+\([^)]*\)\s*\{', line)
        if func_match and i + 1 < len(lines) and 'export const dynamic' in lines[i + 1]:
            # This is the broken pattern: func declaration on line i, 'export const dynamic' on line i+1
            indent = func_match.group(1)
            # Keep the function declaration line (trim trailing {)
            decl = line.rstrip()
            if not decl.endswith('{'):
                decl += ' {'
            new_lines.append(decl)
            # Skip the bad export const dynamic line
            i += 1
            changed = True

            # Now find the closing brace of this function and insert dynamic after it
            brace_count = 1
            i += 1
            while i < len(lines) and brace_count > 0:
                new_lines.append(lines[i])
                brace_count += lines[i].count('{') - lines[i].count('}')
                i += 1

            # Insert 'export const dynamic' before the next non-empty line or at end
            # Actually, it should go right after the function body closes (before the next export or end)
            # But we need to insert it after the closing } that ends the function
            # The brace_count loop ended when we hit 0, so new_lines[-1] is that }
            # Insert dynamic right after it
            new_lines.append(f'{indent}export const dynamic = \'force-dynamic\'')
            continue
        else:
            new_lines.append(line)
            i += 1

    if changed:
        fixed_content = '\n'.join(new_lines)
        # Validate: make sure we don't have consecutive export lines anymore
        lines_check = fixed_content.split('\n')
        has_consecutive = False
        for j, l in enumerate(lines_check):
            if l.strip().startswith('export const dynamic') and j > 0:
                prev = lines_check[j-1].strip()
                if prev.startswith('export '):
                    has_consecutive = True
                    break
        if has_consecutive:
            print(f"WARNING: Still has consecutive exports in {route_file}")
            continue
        route_file.write_text(fixed_content, encoding="utf-8")
        print(f"Fixed: {route_file}")
        fixed_count += 1
    else:
        # Check if the file already has dynamic properly placed
        # Look for orphan export const dynamic inside try blocks
        if 'export const dynamic' in content:
            print(f"Already OK or needs manual review: {route_file}")

print(f"\nTotal files fixed: {fixed_count}")
