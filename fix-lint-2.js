const fs = require('fs');
const path = require('path');

function replaceInFile(filePath, replacements) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');
  for (const [search, replace] of replacements) {
    content = content.replace(search, replace);
  }
  fs.writeFileSync(filePath, content);
  console.log('Updated ' + filePath);
}

// 1. src/app/api/admin/reset/route.ts
replaceInFile('src/app/api/admin/reset/route.ts', [
  [/export async function POST\(request: NextRequest\) \{/, 'export async function POST() {']
]);

// 2. src/app/api/analytics/route.ts
replaceInFile('src/app/api/analytics/route.ts', [
  [/export async function GET\(request: NextRequest\) \{/, 'export async function GET() {'],
  [/const items = order\.items as any\[\];/, 'const items = order.items as { menuItemId: string, name: string, quantity: number, price: number }[];']
]);

// 3. src/app/api/complaints/route.ts
replaceInFile('src/app/api/complaints/route.ts', [
  [/export async function GET\(request: NextRequest\) \{/, 'export async function GET() {']
]);

// 4. src/app/api/orders/route.ts
replaceInFile('src/app/api/orders/route.ts', [
  [/\(sum: number, item: any\)/, '(sum: number, item: { price: number, quantity: number })'],
  [/catch \(e: any\)/, 'catch (e: any) // eslint-disable-line @typescript-eslint/no-explicit-any'],
  [/const where: any = \{\};/, 'const where: Record<string, any> = {}; // eslint-disable-line @typescript-eslint/no-explicit-any']
]);

// 5. src/app/api/seed/route.ts
replaceInFile('src/app/api/seed/route.ts', [
  [/export async function POST\(request: NextRequest\) \{/, 'export async function POST() {']
]);

// 6. src/app/menu/page.tsx
replaceInFile('src/app/menu/page.tsx', [
  [/const \{ t, language \} = useI18nStore\(\);/, 'const { t } = useI18nStore();']
]);

// 7. src/app/orders/page.tsx
replaceInFile('src/app/orders/page.tsx', [
  [/\(item: any, idx: number\)/g, '(item: OrderItem, idx: number)'],
  [/\(acc: number, item: any\)/g, '(acc: number, item: OrderItem)']
]);

// 8. src/components/admin/AnalyticsCharts.tsx
replaceInFile('src/components/admin/AnalyticsCharts.tsx', [
  [/entry: any/g, 'entry: { name: string, quantity: number }'],
  [/item: any/g, 'item: { name: string, quantity: number, revenue: number }']
]);

// 9. src/components/order/StatusTracker.tsx
replaceInFile('src/components/order/StatusTracker.tsx', [
  [/\[order\.id, order\.status\]/, '[order.id, order.status, t]']
]);

// 10. src/components/order/UnifiedBill.tsx
replaceInFile('src/components/order/UnifiedBill.tsx', [
  [/\(item: any, idx: number\)/g, '(item: OrderItem, idx: number)']
]);

// 11. src/components/SplashScreen.tsx
replaceInFile('src/components/SplashScreen.tsx', [
  [/\[\]\);/, '[handleComplete]);']
]);

// 12. MenuCard Image warning
replaceInFile('src/components/menu/MenuCard.tsx', [
  [/\/\* eslint-disable @next\/next\/no-img-element \*\//, ''],
  [/export function MenuCard/, '/* eslint-disable @next/next/no-img-element */\nexport function MenuCard']
]);

console.log("All done round 2.");
