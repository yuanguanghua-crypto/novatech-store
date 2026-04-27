// Find all keys in zh translation that are missing from type definition or en translation
const fs = require('fs');
const content = fs.readFileSync('lib/i18n/translations.ts', 'utf8');
const lines = content.split('\n');

// Extract type definition keys
const typeKeys = new Set();
let inType = false;
for (const line of lines) {
  if (line.includes('export type TranslationKeys')) { inType = true; continue; }
  if (inType && line.match(/^}\s*$/)) { inType = false; continue; }
  if (inType) {
    const m = line.match(/^\s{2}([a-z][a-z0-9_]+):\s*string/);
    if (m) typeKeys.add(m[1]);
  }
}
console.log('Type definition keys count:', typeKeys.size);

// Extract en translation keys
const enKeys = new Set();
let inEn = false, depth = 0;
for (const line of lines) {
  if (line.match(/^\s{2}en:\s*\{/)) { inEn = true; depth = 1; continue; }
  if (inEn) {
    const opens = (line.match(/\{/g) || []).length;
    const closes = (line.match(/\}/g) || []).length;
    depth += opens - closes;
    if (depth <= 0) { inEn = false; continue; }
    const m = line.match(/^\s{4}([a-z][a-z0-9_]+):/);
    if (m) enKeys.add(m[1]);
  }
}
console.log('English keys count:', enKeys.size);

// Extract zh translation keys
const zhKeys = new Set();
let inZh = false; depth = 0;
for (const line of lines) {
  if (line.match(/^\s{2}zh:\s*\{/)) { inZh = true; depth = 1; continue; }
  if (inZh) {
    const opens = (line.match(/\{/g) || []).length;
    const closes = (line.match(/\}/g) || []).length;
    depth += opens - closes;
    if (depth <= 0) { inZh = false; continue; }
    const m = line.match(/^\s{4}([a-z][a-z0-9_]+):/);
    if (m) zhKeys.add(m[1]);
  }
}
console.log('Chinese keys count:', zhKeys.size);

// Find keys missing from type definition
const missingFromType = [...zhKeys].filter(k => !typeKeys.has(k)).sort();
console.log('\nKeys missing from TYPE DEFINITION (count:', missingFromType.length, '):');
missingFromType.forEach(k => console.log(`  ${k}: string`));

// Find keys missing from EN translation
const missingFromEn = [...zhKeys].filter(k => !enKeys.has(k)).sort();
console.log('\nKeys missing from ENGLISH translation (count:', missingFromEn.length, '):');
missingFromEn.forEach(k => console.log(`  ${k}`));
