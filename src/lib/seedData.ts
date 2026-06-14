import { PrismaClient } from '@prisma/client';

export const SEED_MENU_ITEMS = [
  { itemCode: 'RW-001', name: 'Veg Cutlet', nameHindi: 'वेज कटलेट', category: 'Snacks', price: 30, isVeg: true },
  { itemCode: 'RW-002', name: 'Chicken Sandwich', nameHindi: 'चिकन सैंडविच', category: 'Snacks', price: 50, isVeg: false },
  { itemCode: 'RW-003', name: 'Veg Biryani', nameHindi: 'वेज बिरयानी', category: 'Lunch', price: 80, isVeg: true },
  { itemCode: 'RW-004', name: 'Chicken Biryani', nameHindi: 'चिकन बिरयानी', category: 'Lunch', price: 120, isVeg: false },
  { itemCode: 'RW-005', name: 'Masala Dosa', nameHindi: 'मसाला डोसा', category: 'Breakfast', price: 60, isVeg: true },
  { itemCode: 'RW-006', name: 'Idli Sambhar', nameHindi: 'इडली सांभर', category: 'Breakfast', price: 40, isVeg: true },
  { itemCode: 'RW-007', name: 'Tea', nameHindi: 'चाय', category: 'Beverages', price: 10, isVeg: true },
  { itemCode: 'RW-008', name: 'Coffee', nameHindi: 'कॉफी', category: 'Beverages', price: 15, isVeg: true },
  { itemCode: 'RW-009', name: 'Bottled Water (1L)', nameHindi: 'पानी की बोतल', category: 'Beverages', price: 15, isVeg: true },
  { itemCode: 'RW-010', name: 'Veg Thali', nameHindi: 'वेज थाली', category: 'Dinner', price: 100, isVeg: true },
  { itemCode: 'RW-011', name: 'Paneer Curry with Rice', nameHindi: 'पनीर करी राइस', category: 'Dinner', price: 110, isVeg: true },
  { itemCode: 'RW-012', name: 'Samosa (2 pcs)', nameHindi: 'समोसा', category: 'Snacks', price: 20, isVeg: true },
];

export async function upsertMenuItems(prisma: PrismaClient) {
  for (const item of SEED_MENU_ITEMS) {
    await prisma.menuItem.upsert({
      where: { itemCode: item.itemCode },
      update: {
        name: item.name,
        nameHindi: item.nameHindi,
        category: item.category,
        price: item.price,
        isVeg: item.isVeg,
        imageUrl: `https://source.unsplash.com/400x300/?${encodeURIComponent(item.category.toLowerCase() + ',' + item.name.split(' ')[0])}`,
      },
      create: {
        itemCode: item.itemCode,
        name: item.name,
        nameHindi: item.nameHindi,
        category: item.category,
        price: item.price,
        isVeg: item.isVeg,
        imageUrl: `https://source.unsplash.com/400x300/?${encodeURIComponent(item.category.toLowerCase() + ',' + item.name.split(' ')[0])}`,
      },
    });
  }
}
