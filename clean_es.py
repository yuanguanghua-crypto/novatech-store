"""Clean up ES block: remove extra keys not in TranslationKeys type."""
import sys
sys.stdout.reconfigure(encoding='utf-8')
import re

with open(r'E:\novatech-store\lib\i18n\translations.ts', encoding='utf-8') as f:
    lines = f.readlines()

# Get TypeDef keys
tk_start = tk_end = depth = None
for i, line in enumerate(lines):
    if 'export type TranslationKeys' in line:
        tk_start = i; depth = line.count('{') - line.count('}')
    elif tk_start and tk_end is None:
        depth += line.count('{') - line.count('}')
        if depth <= 0: tk_end = i; break
type_keys = set()
for line in lines[tk_start:tk_end]:
    m = re.match(r'^\s+(\w+):', line)
    if m: type_keys.add(m.group(1))
print(f'TypeDef: {len(type_keys)} keys')

# Find ES block
es_start = None
for i, line in enumerate(lines):
    if re.match(r'^const es:', line): es_start = i; break

# Find ES block end
es_end = len(lines)
for j in range(es_start + 1, len(lines)):
    if re.match(r'^const \w+:', lines[j]) or re.match(r'^export const', lines[j]):
        es_end = j
        break

# Build cleaned ES lines
cleaned = ['const es: TranslationKeys = {\n']
removed = 0
kept = 0
i = es_start + 1
while i < es_end:
    m = re.match(r'^(\s+)(\w+):(.+)', lines[i])
    if m:
        indent, key, rest = m.group(1), m.group(2), m.group(3)
        if key in type_keys:
            cleaned.append(lines[i])
            kept += 1
        else:
            removed += 1
    else:
        cleaned.append(lines[i])
    i += 1

cleaned.append('}\n')

new_lines = lines[:es_start] + cleaned + lines[es_end:]
with open(r'E:\novatech-store\lib\i18n\translations.ts', 'w', encoding='utf-8') as f:
    f.writelines(new_lines)

print(f'Done! Kept {kept} keys, removed {removed} extra keys')
