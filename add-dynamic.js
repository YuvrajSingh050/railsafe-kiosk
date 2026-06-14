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

const stringToAdd = "export const dynamic = 'force-dynamic';\n";

for (const file of files) {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    if (!content.includes("export const dynamic = 'force-dynamic';")) {
      fs.writeFileSync(filePath, stringToAdd + content);
      console.log(`Updated ${file}`);
    } else {
      console.log(`Skipped ${file} (already updated)`);
    }
  } else {
    console.error(`File not found: ${file}`);
  }
}
