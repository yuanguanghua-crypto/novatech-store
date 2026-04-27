# -*- coding: utf-8 -*-
"""Fix duplicate keys in HI language block by removing the second occurrence of addr_title block"""
import re

with open(r'E:\novatech-store\lib\i18n\translations.ts', encoding='utf-8') as f:
    lines = f.readlines()

# Find the two occurrences of addr_title in hi block
# Lines in Python are 0-indexed
addr_title_occurrences = []
for i, line in enumerate(lines):
    if '  addr_title:' in line:
        addr_title_occurrences.append(i)

print("addr_title occurrences (0-indexed):", addr_title_occurrences)

# We know HI block has them at approx lines 2275 and 2432 (0-indexed: 2275, 2432)
# The second one at ~2432 is the duplicate. Find where the duplicate block ends
# (ends when we hit a key that was already present above in the hi block)
# The safe approach: delete from second addr_title until we see a key that's NOT a duplicate

# Let's check which keys are before first addr_title (2275) that also appear after (2432)
first_idx = addr_title_occurrences[-2]  # second to last = first in HI
second_idx = addr_title_occurrences[-1]  # last = duplicate in HI

print(f"First at line {first_idx+1}, Second at line {second_idx+1}")

# Collect keys from first addr_title block
first_block_keys = set()
depth = 0
for i in range(first_idx, second_idx):
    m = re.match(r'^\s+(\w+):', lines[i])
    if m:
        first_block_keys.add(m.group(1))

print(f"Keys in first block: {len(first_block_keys)}")

# Find end of duplicate block: when key is NOT in first_block_keys
dup_end = second_idx
for i in range(second_idx, len(lines)):
    m = re.match(r'^\s+(\w+):', lines[i])
    if m:
        if m.group(1) not in first_block_keys:
            dup_end = i
            break
    # Check if we hit a new language block or end of object
    if re.match(r'^const \w+:', lines[i]) or re.match(r'^\}', lines[i]) or re.match(r'^export', lines[i]):
        dup_end = i
        break

print(f"Duplicate block: lines {second_idx+1} to {dup_end} (will remove)")

# Remove the duplicate block
new_lines = lines[:second_idx] + lines[dup_end:]

with open(r'E:\novatech-store\lib\i18n\translations.ts', 'w', encoding='utf-8') as f:
    f.writelines(new_lines)

print(f"Removed {dup_end - second_idx} lines")
print("Done.")
