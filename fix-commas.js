const fs = require('fs');

let content = fs.readFileSync('lib/i18n/translations.ts', 'utf8');
const lines = content.split('\n');

let fixed = 0;
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  // Match lines with key: 'value' pattern (4 spaces indent, no trailing comma)
  // Must NOT already end with comma
  if (/^    \w+: '.+'$/.test(line)) {
    lines[i] = line + ',';
    fixed++;
  }
  // Also match lines with key: "value" pattern  
  if (/^    \w+: ".+"$/.test(line)) {
    lines[i] = line + ',';
    fixed++;
  }
  // Match key: `template` pattern
  if (/^    \w+: `[^`]+`$/.test(line)) {
    lines[i] = line + ',';
    fixed++;
  }
}

console.log(`Fixed ${fixed} lines missing commas`);
fs.writeFileSync('lib/i18n/translations.ts', lines.join('\n'), 'utf8');
console.log('Done!');
