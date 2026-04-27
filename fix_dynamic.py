#!/usr/bin/env python3
"""Fix broken 'export const dynamic' placement in API route files.

Problem: previous script concatenated the dynamic export wrong:
  export async function GET(req: NextRequest) {
  export const dynamic = 'force-dynamic'

Solution: remove ALL broken 'export const dynamic' lines from inside functions,
then add ONE correct 'export const dynamic = \'force-dynamic\'' at the END of the file.
"""

import re
from pathlib import Path

API_DIR = Path("E:/novatech-store/app/api")
DYNAMIC_EXPORT = "export const dynamic = 'force-dynamic'"

fixed_files = []
skipped_files = []

for route_file in sorted(API_DIR.rglob("route.ts")):
    try:
        content = route_file.read_text(encoding="utf-8")
    except Exception as e:
        print(f"ERROR reading {route_file}: {e}")
        continue

    original = content

    # Step 1: Remove ALL 'export const dynamic = ...' lines from anywhere in the file
    # (they're all wrong placements)
    content = re.sub(r'\n?\s*export\s+const\s+dynamic\s*=\s*[^\n]+\n?', '\n', content)

    # Step 2: Clean up any blank lines left behind (more than 2 consecutive newlines)
    content = re.sub(r'\n{3,}', '\n\n', content)

    # Step 3: Strip trailing whitespace from each line and final trailing newline
    lines = content.rstrip().split('\n')
    # Remove trailing empty lines that may have been created
    while lines and not lines[-1].strip():
        lines.pop()

    # Step 4: Ensure file ends cleanly
    content = '\n'.join(lines).rstrip() + '\n'

    # Step 5: Append the correct dynamic export at the very end (after all functions)
    # Check if it's already there (some files may have it correctly placed)
    if DYNAMIC_EXPORT not in content:
        content = content.rstrip() + '\n' + DYNAMIC_EXPORT + '\n'
        changed = True
    else:
        changed = True  # We still changed it (removed broken ones)

    if content != original:
        route_file.write_text(content, encoding="utf-8")
        rel = route_file.relative_to(Path("E:/novatech-store"))
        print(f"Fixed:  {rel}")
        fixed_files.append(str(route_file))
    else:
        rel = route_file.relative_to(Path("E:/novatech-store"))
        print(f"OK:     {rel}")

print(f"\n{'='*50}")
print(f"Total files processed: {len(fixed_files)}")
