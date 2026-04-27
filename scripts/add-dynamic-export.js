const fs = require('fs');
const path = require('path');

function addDynamicExport(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Skip if already has dynamic export
  if (content.includes("export const dynamic")) {
    console.log(`Skipped (already has): ${filePath}`);
    return;
  }
  
  // Add dynamic export after imports
  const lines = content.split('\n');
  let insertIndex = 0;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line === '' || line.startsWith('//') || line.startsWith('/*') || line.startsWith('*')) {
      continue;
    }
    if (line.startsWith('import ') || line.startsWith('export ')) {
      insertIndex = i + 1;
    } else {
      break;
    }
  }
  
  // Insert the dynamic export
  lines.splice(insertIndex, 0, "export const dynamic = 'force-dynamic'", '');
  fs.writeFileSync(filePath, lines.join('\n'), 'utf8');
  console.log(`Fixed: ${filePath}`);
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      walkDir(filePath);
    } else if (file === 'route.ts') {
      addDynamicExport(filePath);
    }
  }
}

walkDir(path.join(__dirname, '..', 'app', 'api'));
console.log('Done!');
