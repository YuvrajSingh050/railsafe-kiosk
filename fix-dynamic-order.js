const fs = require('fs');
const path = require('path');

const files = [
  'src/app/api/menu/route.ts',
  'src/app/api/orders/route.ts',
  'src/app/api/orders/[id]/route.ts',
  'src/app/api/complaints/route.ts',
  'src/app/api/complaints/[id]/route.ts',
  'src/app/api/analytics/route.ts',
  'src/app/api/seed/route.ts',
  'src/app/api/admin/reset/route.ts'
];

for (const file of files) {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Remove the previously prepended string and any trailing whitespace it left
    content = content.replace(/^export const dynamic = 'force-dynamic';\r?\n+/, '');
    
    // Also remove it if it happens to be anywhere else to prevent duplicates
    content = content.replace(/export const dynamic = 'force-dynamic';\r?\n/g, '');
    
    // Find the end of imports
    const lines = content.split(/\r?\n/);
    let lastImportIndex = -1;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].startsWith('import ')) {
        lastImportIndex = i;
      }
    }
    
    // Insert after imports
    if (lastImportIndex !== -1) {
      lines.splice(lastImportIndex + 1, 0, '', "export const dynamic = 'force-dynamic';");
    } else {
      lines.unshift("export const dynamic = 'force-dynamic';", '');
    }
    
    fs.writeFileSync(filePath, lines.join('\n'));
    console.log(`Fixed imports order in ${file}`);
  }
}
