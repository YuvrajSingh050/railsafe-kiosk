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
    
    // Remove existing dynamic export
    content = content.replace(/export const dynamic = 'force-dynamic';\r?\n?/g, '');
    
    // Prepend to the very top
    content = "export const dynamic = 'force-dynamic';\n" + content.trimStart();
    
    fs.writeFileSync(filePath, content);
    console.log(`Moved export const dynamic to top of ${file}`);
  }
}
