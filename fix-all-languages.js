const fs = require('fs');

let content = fs.readFileSync('lib/i18n/translations.ts', 'utf8');
const lines = content.split('\n');

// ===== Find boundaries =====
let typeDefStart = -1, typeDefEnd = -1;
let enStart = -1, enEnd = -1;
let zhStart = -1, zhEnd = -1;
let esStart = -1, esEnd = -1;
let jaStart = -1, jaEnd = -1;
let hiStart = -1, hiEnd = -1;
let arStart = -1, arEnd = -1;
let ptStart = -1, ptEnd = -1;

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('export type TranslationKeys = {')) typeDefStart = i;
  if (typeDefStart > 0 && typeDefEnd < 0 && lines[i] === '}') { typeDefEnd = i; }
}

// Find all language blocks
function findBlock(lang, afterLine = 0) {
  let start = -1, end = -1;
  for (let i = afterLine; i < lines.length; i++) {
    if (lines[i] === `  ${lang}: {`) { start = i; }
    if (start > 0 && end < 0 && lines[i] === '  },') { end = i; break; }
  }
  return { start, end };
}

const enBlock = findBlock('en');
enStart = enBlock.start; enEnd = enBlock.end;
const zhBlock = findBlock('zh', enEnd + 1);
zhStart = zhBlock.start; zhEnd = zhBlock.end;
const esBlock = findBlock('es', zhEnd + 1);
esStart = esBlock.start; esEnd = esBlock.end;
const jaBlock = findBlock('ja', esEnd + 1);
jaStart = jaBlock.start; jaEnd = jaBlock.end;
const hiBlock = findBlock('hi', jaEnd + 1);
hiStart = hiBlock.start; hiEnd = hiBlock.end;
const arBlock = findBlock('ar', hiEnd + 1);
arStart = arBlock.start; arEnd = arBlock.end;
const ptBlock = findBlock('pt', arEnd + 1);
ptStart = ptBlock.start; ptEnd = ptBlock.end;

console.log('Type def:', typeDefStart, '-', typeDefEnd);
console.log('EN:', enStart, '-', enEnd);
console.log('ZH:', zhStart, '-', zhEnd);
console.log('ES:', esStart, '-', esEnd);

// ===== Extract keys from a block =====
function extractKeys(start, end) {
  const keys = new Set();
  const keyValues = {};
  for (let i = start + 1; i < end; i++) {
    const m = lines[i].match(/^\s{4}(\w+):\s*(.+?),?\s*$/);
    if (m) {
      keys.add(m[1]);
      keyValues[m[1]] = m[2].trim().replace(/,\s*$/, '');
    }
  }
  return { keys, keyValues };
}

const { keys: typeKeys } = (() => {
  const keys = new Set();
  for (let i = typeDefStart + 1; i < typeDefEnd; i++) {
    const m = lines[i].match(/^\s+(\w+):\s*string/);
    if (m) keys.add(m[1]);
  }
  return { keys };
})();

const { keys: enKeys, keyValues: enKeyValues } = extractKeys(enStart, enEnd);
const { keys: zhKeys } = extractKeys(zhStart, zhEnd);
const { keys: esKeys } = extractKeys(esStart, esEnd);
const { keys: jaKeys } = extractKeys(jaStart, jaEnd);
const { keys: hiKeys } = extractKeys(hiStart, hiEnd);
const { keys: arKeys } = extractKeys(arStart, arEnd);
const { keys: ptKeys } = extractKeys(ptStart, ptEnd);

console.log('\nType keys:', typeKeys.size);
console.log('EN keys:', enKeys.size);
console.log('ZH keys:', zhKeys.size);

// Find what each language is missing
function getMissing(langKeys) {
  return [...typeKeys].filter(k => !langKeys.has(k));
}

const zhMissing = getMissing(zhKeys);
const esMissing = getMissing(esKeys);
const jaMissing = getMissing(jaKeys);
const hiMissing = getMissing(hiKeys);
const arMissing = getMissing(arKeys);
const ptMissing = getMissing(ptKeys);

console.log('ZH missing:', zhMissing.length);
console.log('ES missing:', esMissing.length);
console.log('JA missing:', jaMissing.length);
console.log('HI missing:', hiMissing.length);
console.log('AR missing:', arMissing.length);
console.log('PT missing:', ptMissing.length);

// ===== Insert missing keys into a block =====
// Strategy: insert before closing "  }," using English values as fallback
function insertMissingKeys(content, blockEnd, missingKeys, enKeyValues) {
  if (missingKeys.length === 0) return content;
  
  const insertLines = missingKeys
    .map(k => `    ${k}: ${enKeyValues[k] || "''"}, // TODO: translate`)
    .join('\n');
  
  // Split at blockEnd line
  const contentLines = content.split('\n');
  // Find the actual line in current content (may have shifted)
  // Re-scan for the block end
  // We'll use regex to find the insertion point by searching for unique nearby content
  // Instead, just work with line numbers directly
  
  contentLines.splice(blockEnd, 0, insertLines);
  return contentLines.join('\n');
}

// ===== Apply all fixes =====
// We need to work carefully with line numbers since they shift after each insertion
// Process in reverse order (last block first) to preserve line numbers

let updatedContent = content;

// Helper: insert lines before a specific line number
function insertBeforeLine(fileContent, lineNum, newLines) {
  const arr = fileContent.split('\n');
  arr.splice(lineNum, 0, ...newLines);
  return arr.join('\n');
}

// Find current block ends by scanning the current content
function findBlockEnd(fileContent, langCode, afterLine = 0) {
  const arr = fileContent.split('\n');
  let start = -1;
  for (let i = afterLine; i < arr.length; i++) {
    if (arr[i] === `  ${langCode}: {`) start = i;
    if (start >= 0 && arr[i] === '  },') return i;
  }
  return -1;
}

// Process in reverse order to preserve line numbers
const langsToFix = [
  { lang: 'pt', missing: ptMissing },
  { lang: 'ar', missing: arMissing },
  { lang: 'hi', missing: hiMissing },
  { lang: 'ja', missing: jaMissing },
  { lang: 'es', missing: esMissing },
  { lang: 'zh', missing: zhMissing },
];

for (const { lang, missing } of langsToFix) {
  if (missing.length === 0) continue;
  
  const blockEnd = findBlockEnd(updatedContent, lang);
  if (blockEnd < 0) {
    console.log(`Could not find ${lang} block!`);
    continue;
  }
  
  // Make sure the last line before }, has a comma
  const arr = updatedContent.split('\n');
  const lastKeyLine = arr[blockEnd - 1];
  if (lastKeyLine && !lastKeyLine.trim().endsWith(',') && lastKeyLine.trim() !== '') {
    arr[blockEnd - 1] = lastKeyLine.trimEnd() + ',';
    updatedContent = arr.join('\n');
  }
  
  const newLines = missing.map(k => `    ${k}: ${enKeyValues[k] || "''"},`);
  updatedContent = insertBeforeLine(updatedContent, blockEnd, newLines);
  console.log(`Added ${missing.length} missing keys to ${lang} block`);
}

fs.writeFileSync('lib/i18n/translations.ts', updatedContent, 'utf8');
console.log('\nAll languages fixed!');
