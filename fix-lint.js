const fs = require('fs');
const path = require('path');

function replaceInFile(filePath, replacements) {
  let content = fs.readFileSync(filePath, 'utf8');
  for (const [search, replace] of replacements) {
    content = content.replace(search, replace);
  }
  fs.writeFileSync(filePath, content);
  console.log('Updated ' + filePath);
}

// 1. src/app/admin/page.tsx
replaceInFile('src/app/admin/page.tsx', [
  [/const router = useRouter\(\);\n/, ''],
  [/import \{ useRouter \} from "next\/navigation";\n/, ''],
  [/const \[data, setData\] = useState<any>\(null\);/, 'const [data, setData] = useState<AnalyticsData | null>(null);'],
  [/const \[orders, setOrders\] = useState<any\[\]>\(\[\]\);/, 'const [orders, setOrders] = useState<Order[]>([]);'],
  [/const \[complaints, setComplaints\] = useState<any\[\]>\(\[\]\);/, 'const [complaints, setComplaints] = useState<Complaint[]>([]);'],
  [/import \{ toast \} from "sonner";/, 'import { toast } from "sonner";\nimport { Order, Complaint, AnalyticsData } from "@/types";']
]);

// 2. src/app/api/admin/reset/route.ts
replaceInFile('src/app/api/admin/reset/route.ts', [
  [/export async function POST\(request: Request\) \{/, 'export async function POST() {']
]);

// 3. src/app/api/analytics/route.ts
replaceInFile('src/app/api/analytics/route.ts', [
  [/export async function GET\(request: Request\) \{/, 'export async function GET() {'],
  [/\(acc: any, order\) =>/, '(acc: Record<string, number>, order) =>']
]);

// 4. src/app/api/complaints/route.ts
replaceInFile('src/app/api/complaints/route.ts', [
  [/export async function GET\(request: Request\) \{/, 'export async function GET() {']
]);

// 5. src/app/api/orders/route.ts
replaceInFile('src/app/api/orders/route.ts', [
  [/items: body\.items\.map\(\(item: any\) =>/, 'items: body.items.map((item: { menuItemId: string; name: string; price: number; quantity: number }) =>'],
  [/export async function GET\(request: Request\) \{/, 'export async function GET() {'],
  [/export async function PATCH\(request: Request, \{ params \}: any\) \{/, 'export async function PATCH(request: Request, { params }: { params: { id: string } }) {']
]);

// 6. src/app/api/seed/route.ts
replaceInFile('src/app/api/seed/route.ts', [
  [/export async function POST\(request: Request\) \{/, 'export async function POST() {']
]);

// 7. src/app/cart/page.tsx
replaceInFile('src/app/cart/page.tsx', [
  [/import \{ Input \} from "@\/components\/ui\/input";\n/, '']
]);

// 8. src/app/complaint/page.tsx
replaceInFile('src/app/complaint/page.tsx', [
  [/import Link from "next\/link";\n/, '']
]);

// 9. src/app/menu/page.tsx
replaceInFile('src/app/menu/page.tsx', [
  [/const \{ language \} = useI18nStore\(\);\n/, '']
]);

// 10. src/app/order/[orderId]/page.tsx
replaceInFile('src/app/order/[orderId]/page.tsx', [
  [/const \[order, setOrder\] = useState<any>\(null\);/, 'const [order, setOrder] = useState<Order | null>(null);'],
  [/import \{ useI18nStore \} from "@\/lib\/i18n";/, 'import { useI18nStore } from "@/lib/i18n";\nimport { Order } from "@/types";']
]);

// 11. src/app/orders/page.tsx
replaceInFile('src/app/orders/page.tsx', [
  [/const \[orders, setOrders\] = useState<any\[\]>\(\[\]\);/, 'const [orders, setOrders] = useState<Order[]>([]);'],
  [/\(item: any, idx: number\)/, '(item: OrderItem, idx: number)'],
  [/order\.items\.reduce\(\(acc: number, item: any\)/, 'order.items.reduce((acc: number, item: OrderItem)'],
  [/import \{ Button \} from "@\/components\/ui\/button";/, 'import { Button } from "@/components/ui/button";\nimport { Order, OrderItem } from "@/types";']
]);

// 12. src/components/admin/AnalyticsCharts.tsx
replaceInFile('src/components/admin/AnalyticsCharts.tsx', [
  [/data: any/, 'data: AnalyticsData["charts"]'],
  [/value: any/, 'value: string | number'],
  [/\(value: any\)/, '(value: string | number)'],
  [/import \{ Card, CardContent, CardHeader, CardTitle \} from "@\/components\/ui\/card";/, 'import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";\nimport { AnalyticsData } from "@/types";']
]);

// 13. src/components/admin/ComplaintsTable.tsx
replaceInFile('src/components/admin/ComplaintsTable.tsx', [
  [/complaints: any\[\]/, 'complaints: Complaint[]'],
  [/import \{ Loader2 \} from "lucide-react";/, 'import { Loader2 } from "lucide-react";\nimport { Complaint } from "@/types";']
]);

// 14. src/components/admin/DemoBanner.tsx
replaceInFile('src/components/admin/DemoBanner.tsx', [
  [/Use 'Reset Demo Data' button/, 'Use &apos;Reset Demo Data&apos; button']
]);

// 15. src/components/admin/KPICards.tsx
replaceInFile('src/components/admin/KPICards.tsx', [
  [/data: any/, 'data: AnalyticsData["kpis"]'],
  [/import \{ Receipt, IndianRupee, AlertCircle, TrendingUp \} from "lucide-react";/, 'import { Receipt, IndianRupee, AlertCircle, TrendingUp } from "lucide-react";\nimport { AnalyticsData } from "@/types";']
]);

// 16. src/components/admin/OrdersTable.tsx
replaceInFile('src/components/admin/OrdersTable.tsx', [
  [/orders: any\[\]/, 'orders: Order[]'],
  [/import \{ Loader2 \} from "lucide-react";/, 'import { Loader2 } from "lucide-react";\nimport { Order } from "@/types";']
]);

// 17. src/components/admin/ResetDialog.tsx
replaceInFile('src/components/admin/ResetDialog.tsx', [
  [/  AlertDialogAction, \n/, '']
]);

// 18. src/components/menu/CategoryTabs.tsx
replaceInFile('src/components/menu/CategoryTabs.tsx', [
  [/t\(category\.toLowerCase\(\) as any\)/, 't(category.toLowerCase() as keyof typeof t)']
]);

// 19. src/components/menu/MenuCard.tsx
replaceInFile('src/components/menu/MenuCard.tsx', [
  [/import Image from "next\/image";\n/, '']
]);

// 20. src/components/order/StatusTracker.tsx
replaceInFile('src/components/order/StatusTracker.tsx', [
  [/initialOrder: any/, 'initialOrder: Order'],
  [/const \{ t, language \} = useI18nStore\(\);/, 'const { t } = useI18nStore();'],
  [/t\(`status\$\{data\.status\.replace\(\/ \/g, ''\)\}` as any\)/g, 't(`status${data.status.replace(/ /g, \'\')}` as keyof typeof t)'],
  [/t\(`status\$\{status\.replace\(\/ \/g, ''\)\}` as any\)/g, 't(`status${status.replace(/ /g, \'\')}` as keyof typeof t)'],
  [/t\(`status\$\{order\.status\.replace\(\/ \/g, ''\)\}` as any\)/g, 't(`status${order.status.replace(/ /g, \'\')}` as keyof typeof t)'],
  [/useEffect\(\(\) => \{/, 'useEffect(() => {\n    const fetchStatus = async (showToast = false) => {\n      try {\n        setLoading(true);\n        const res = await fetch(`/api/orders/${order.id}`);\n        if (res.ok) {\n          const data = await res.json();\n          if (data.status !== order.status && showToast) {\n            toast.success(`Status updated to: ${t(`status${data.status.replace(/ /g, \'\')}` as keyof typeof t)}`);\n          } else if (showToast) {\n            toast.info("No change yet");\n          }\n          setOrder(data);\n        }\n      } catch (error) {\n        console.error(error);\n      } finally {\n        setLoading(false);\n      }\n    };\n'],
  [/  const fetchStatus = async \(showToast = false\) => \{[\s\S]*?  \};\n\n  useEffect/m, '  useEffect'],
  [/import \{ Badge \} from "@\/components\/ui\/badge";/, 'import { Badge } from "@/components/ui/badge";\nimport { Order } from "@/types";']
]);

// 21. src/components/order/UnifiedBill.tsx
replaceInFile('src/components/order/UnifiedBill.tsx', [
  [/order: any/, 'order: Order'],
  [/item: any/, 'item: OrderItem'],
  [/"Pay exactly this amount.<br\/>No extra charges applicable."/, '&quot;Pay exactly this amount.<br/>No extra charges applicable.&quot;'],
  [/import \{ format \} from "date-fns";/, 'import { format } from "date-fns";\nimport { Order, OrderItem } from "@/types";']
]);

// 22. src/components/SplashScreen.tsx
replaceInFile('src/components/SplashScreen.tsx', [
  [/\[\]\);/, '[onComplete]);']
]);

console.log("All done.");
