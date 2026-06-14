# RailSafe Food Kiosk

## What is RailSafe?

**RailSafe** is a "Bill First" digital food ordering and billing system for Indian Railways coaches. It solves a critical problem: passengers on Indian trains are often overcharged for food by pantry vendors. RailSafe eliminates this by generating an **official printed bill before the passenger pays** — ensuring complete transparency and preventing fraud.

### The Innovation: "Bill First"
1. Passenger approaches the touchscreen kiosk in their coach
2. Browses the official railway food menu with exact prices
3. Selects items and enters seat number
4. System generates:
   - **Customer Bill** (official receipt with QR code for complaints)
   - **Kitchen Slip** (dashed-border slip given to pantry staff)
5. Passenger tears off the kitchen slip, gives it to staff
6. Staff prepares food, delivers to seat
7. **Passenger pays exactly the printed amount — no negotiation, no surprises**
8. QR code on bill links to complaint form for disputes

### Key Features
- **Official pricing**: Menu powered by Indian Railways database
- **Print-ready bills & slips**: Thermal printer compatible (58mm/80mm width)
- **Order tracking**: Live status updates (Ordered → Preparing → Out for Delivery → Delivered)
- **Complaint system**: Easy way to report overcharging, quality issues, delays
- **Admin dashboard**: Staff can update order status, view complaints, see analytics
- **Responsive UI**: Works on tablet kiosks, mobile, and desktop
- **Multi-language ready**: Design supports English/Hindi (infrastructure in place)

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm 9+
- PostgreSQL database (local Prisma Postgres or cloud: Neon, Supabase)

### Installation

1. **Clone the repository**
```bash
   git clone https://github.com/[your-username]/railsafe-kiosk.git
   cd railsafe-kiosk
```

2. **Install dependencies**
```bash
   npm install
```

3. **Set up database**
   
   If using **local Prisma Postgres** (already configured):
```bash
   npx prisma db push
```
   
   If using **cloud Postgres** (Neon/Supabase):
   - Create a free PostgreSQL database at [Neon](https://neon.tech) or [Supabase](https://supabase.com)
   - Copy the connection string
   - Update `.env`:
```env
     DATABASE_URL="postgresql://user:password@host/database"
     NEXT_PUBLIC_ADMIN_PASSWORD="admin123"
```

4. **Run migrations & seed**
```bash
   npx prisma migrate dev --name init
   npx prisma db seed
```

5. **Start development server**
```bash
   npm run dev
```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Project Structure
```
railsafe-kiosk/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── page.tsx            # Kiosk Home (splash + train/coach selector)
│   │   ├── menu/page.tsx       # Food menu grid
│   │   ├── cart/page.tsx       # Cart & checkout
│   │   ├── order/[orderId]/    # Bill, slip, status tracker
│   │   ├── orders/page.tsx     # Order history
│   │   ├── complaint/page.tsx  # Complaint form (QR pre-fill)
│   │   ├── admin/page.tsx      # Admin dashboard (password-gated)
│   │   ├── api/                # Backend API routes
│   │   └── globals.css         # Global styles + print CSS
│   ├── components/             # React components
│   │   ├── layout/             # Header, Footer
│   │   ├── menu/               # Menu, CategoryTabs, CartBar
│   │   ├── cart/               # CartItem
│   │   ├── order/              # CustomerBill, KitchenSlip, StatusTracker
│   │   ├── admin/              # KPICards, OrdersTable, ComplaintsTable, AnalyticsCharts
│   │   └── SplashScreen.tsx
│   ├── store/                  # Zustand state (cart, session)
│   ├── lib/                    # Utilities (prisma, utils, types, seedData)
│   ├── types/index.ts          # TypeScript types
│   └── i18n/                   # i18n JSON (en.json, hi.json) [optional]
├── prisma/
│   ├── schema.prisma           # Database schema
│   ├── seed.ts                 # Seed script (12 menu items)
│   └── migrations/
├── public/                     # Static assets
├── package.json
├── next.config.mjs
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

---

## How It Works

### User Flow: Passenger Ordering
1. **Kiosk Home** (`/`): Select train number, coach number
2. **Menu** (`/menu`): Browse categories, search items, add to cart
3. **Cart** (`/cart`): Review items, enter seat number
4. **Bill & Slip** (`/order/[orderId]`): See official bill with QR code, print both bill & slip
5. **Status Tracking** (`/order/[orderId]`): Watch order status in real-time
6. **Complaint** (`/complaint`): File a complaint if needed (via QR scan or manual entry)

### Admin Flow: Railway Staff
1. **Admin Dashboard** (`/admin`): Password-gated access
2. **Overview**: View KPIs (orders today, revenue, pending complaints)
3. **Orders**: Update order status as food is prepared and delivered
4. **Complaints**: Review and resolve customer complaints
5. **Analytics**: See revenue trends, best-selling items, order volume
6. **Reset**: Clear all demo data and start fresh (for testing)

---

## Core Features Explained

### "Bill First" System
- Prevents overcharging by showing official price before payment
- QR code on bill allows passengers to quickly report disputes
- Kitchen slip tracks food preparation and delivery

### Official Menu & Pricing
- 12 sample items with official Indian Railways pricing (modifiable)
- Categories: Breakfast, Lunch, Dinner, Snacks, Beverages
- Veg/Non-veg indicators

### Order Status Tracking
Real-time status updates:
- **Ordered**: Kitchen received the order
- **Preparing**: Food is being cooked
- **Out for Delivery**: Pantry staff bringing to seat
- **Delivered**: Passenger received food

### Print-Ready Receipts
- Customer Bill: Official receipt with QR code, ideal for thermal printing (80mm width)
- Kitchen Slip: Dashed-border slip for kitchen staff
- Both render cleanly on 58mm/80mm thermal printers via CSS `@media print`

---

## API Endpoints

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/menu` | GET | Fetch menu items (filterable by category) |
| `/api/orders` | GET, POST | List orders or create new order |
| `/api/orders/[id]` | GET, PATCH | Get order details or update status |
| `/api/complaints` | GET, POST | List complaints or file new complaint |
| `/api/complaints/[id]` | PATCH | Update complaint status |
| `/api/analytics` | GET | Fetch KPIs, revenue charts, top items |
| `/api/seed` | POST | Trigger database seeding |
| `/api/admin/reset` | POST | Reset demo data (delete orders, re-seed menu) |

---

## Admin Access

**Demo Credentials**:
- Password: `admin123` (set via `NEXT_PUBLIC_ADMIN_PASSWORD` env var)
- **Note**: This is demo-only authentication, not secure. For production, integrate proper session-based auth (NextAuth.js, etc.).

**Admin Dashboard Features**:
- Password gate to prevent unauthorized access
- Overview KPIs (orders today, revenue, complaints)
- Orders table with inline status updates
- Complaints management (view, toggle Open/Resolved)
- Analytics charts (Recharts): revenue by day, top items, order distribution
- Reset Demo Data button with confirmation

---

## 90-Second Demo Script (for Judges)

**Narrative**: Show how RailSafe prevents overcharging through "Bill First" transparency.

1. **[0s] Kiosk Home** — "Passenger boards train, approaches the kiosk. Select train number and coach."
   - Input train "12345", select coach "B4"
   
2. **[10s] Menu** — "Browse official menu with exact prices. No hidden charges."
   - Show menu, point out prices (₹80 Veg Biryani, ₹50 Chicken Sandwich, etc.)
   
3. **[20s] Cart & Bill** — "Select food, enter seat number, generate official bill BEFORE paying."
   - Add 2-3 items, enter seat "B4-23", click "Generate Bill"
   
4. **[30s] Customer Bill** — "Official bill shows exact total with no extra charges. QR code for complaints."
   - Show bill with items, total, QR code. Highlight: "Pay exactly this amount."
   
5. **[40s] Kitchen Slip** — "Staff gets slip with items and seat — no ambiguity."
   - Show kitchen slip format
   
6. **[50s] Admin Dashboard** — "Switch to staff view. Admin updates order status in real-time."
   - Login with password, show Orders table, update status "Ordered" → "Preparing" → "Delivered"
   
7. **[60s] Live Status Update** — "Customer sees status change instantly on their order page."
   - Refresh order page, show status tracker updated to "Delivered"
   
8. **[75s] Complaint System** — "If passenger disputes, QR code opens quick complaint form."
   - Scan QR (or manually open `/complaint?orderNumber=...&seatNumber=...`)
   - Admin sees complaint, marks resolved
   
9. **[90s] Close** — "RailSafe eliminates overcharging through transparency, official pricing, and accountability."

---

## Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub**
```bash
   git add .
   git commit -m "RailSafe MVP ready for deployment"
   git push origin main
```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repo
   - Vercel auto-detects Next.js project

3. **Set Environment Variables**
   - Add to Vercel project settings:
     `DATABASE_URL=postgresql://...` (from Neon/Supabase)
     `NEXT_PUBLIC_ADMIN_PASSWORD=admin123` (or your secure password)

4. **Deploy**
   - Click "Deploy" — Vercel builds and deploys automatically
   - Live URL: `https://[your-project].vercel.app`

5. **Test Live**
   - Visit homepage, go through full flow
   - Admin login at `/admin` with password

---

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **State**: Zustand (cart, session)
- **Database**: PostgreSQL via Prisma ORM
- **Charts**: Recharts
- **QR Codes**: qrcode.react
- **Notifications**: Sonner
- **Icons**: lucide-react

---

## Testing Checklist

Before submission:
- [ ] `npm run dev` starts without errors
- [ ] `npx prisma migrate dev` and `npx prisma db seed` complete successfully
- [ ] Full user flow: Home → Menu → Cart → Bill → Status → Admin works end-to-end
- [ ] Admin password gate: correct password unlocks dashboard
- [ ] Reset Demo Data: clears orders/complaints, re-seeds menu
- [ ] Print Customer Bill & Kitchen Slip on 80mm thermal printer width
- [ ] QR code on bill scans and pre-fills complaint form
- [ ] Status tracker auto-polls and manual refresh works
- [ ] Analytics charts render with data
- [ ] Responsive on mobile (375px), tablet (1024px), desktop (1920px)
- [ ] No console errors or warnings

---

## Future Enhancements

- [ ] Real i18n with language toggle (English/Hindi)
- [ ] Multi-language support for menu items
- [ ] SMS/WhatsApp notifications for order status
- [ ] Integration with real railway ticketing system
- [ ] Payment gateway (Razorpay, PhonePe)
- [ ] Actual thermal printer integration
- [ ] Advanced analytics (revenue trends, customer insights)
- [ ] Feedback/rating system
- [ ] Staff role-based access control

---

## Contributing

This is a hackathon MVP. Feel free to extend and improve!

---

## License

MIT License — use freely for educational and commercial purposes.

---

## Contact & Support

For issues, feedback, or questions:
- GitHub: [@YuvrajSingh050](https://github.com/YuvrajSingh050)
- Email: [yuvrajsingh05072010@gmail.com](mailto:yuvrajsingh05072010@gmail.com)
- Helpline: 139 (Indian Railways)

---

**Built for the Faraway Hackathon 2026**  
"Know Your Bill Before You Pay — RailSafe Food Kiosk"
