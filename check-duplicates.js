const fs = require('fs');

const content = fs.readFileSync('lib/i18n/translations.ts', 'utf8');
const lines = content.split('\n');

// Find all language blocks
const langBlocks = {};
const languages = ['en', 'zh', 'es', 'ja', 'hi', 'ar', 'pt'];

let currentLang = null;
let blockStart = -1;
let blockEnd = -1;

for (let i = 0; i < lines.length; i++) {
  for (const lang of languages) {
    if (lines[i] === `  ${lang}: {`) {
      currentLang = lang;
      blockStart = i;
    }
  }
  if (currentLang && lines[i] === '  },') {
    if (!langBlocks[currentLang]) {
      langBlocks[currentLang] = { start: blockStart, end: i };
    }
    currentLang = null;
  }
}

console.log('Language blocks found:', Object.keys(langBlocks));

// Check for duplicate keys in each block
let hasDuplicates = false;
for (const [lang, { start, end }] of Object.entries(langBlocks)) {
  const seen = {};
  const duplicates = [];
  for (let i = start + 1; i < end; i++) {
    const m = lines[i].match(/^\s{4}(\w+):/);
    if (m) {
      const key = m[1];
      if (seen[key]) {
        duplicates.push({ key, line1: seen[key], line2: i + 1 });
      } else {
        seen[key] = i + 1;
      }
    }
  }
  if (duplicates.length > 0) {
    hasDuplicates = true;
    console.log(`\n${lang.toUpperCase()} has ${duplicates.length} duplicate keys:`);
    duplicates.forEach(d => console.log(`  - ${d.key} (lines ${d.line1} and ${d.line2})`));
  }
}

if (!hasDuplicates) {
  console.log('No duplicate keys found!');
}
