import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateOrderNumber } from "@/lib/utils";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { trainNumber, coachNumber, seatNumber, items } = body;

    if (!trainNumber || !coachNumber || !seatNumber || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const totalAmount = items.reduce((sum: number, item: { price: number, quantity: number }) => sum + (item.price * item.quantity), 0);

    // Collision-safe order number generation loop (though extremely rare)
    let orderNumber = generateOrderNumber();
    let order = null;
    let retries = 0;

    while (!order && retries < 3) {
      try {
        order = await prisma.order.create({
          data: {
            orderNumber,
            trainNumber,
            coachNumber,
            seatNumber,
            items, // Prisma handles JSON serialization
            totalAmount,
            status: "Ordered",
          },
        });
      } catch (e: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
        if (e.code === 'P2002') {
          // Unique constraint failed, try again
          orderNumber = generateOrderNumber();
          retries++;
        } else {
          throw e;
        }
      }
    }

    if (!order) {
      throw new Error("Failed to generate a unique order number");
    }

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error("Failed to create order:", error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const seatNumber = searchParams.get("seatNumber");
    const date = searchParams.get("date"); // YYYY-MM-DD

    const where: Record<string, any> = {}; // eslint-disable-line @typescript-eslint/no-explicit-any
    if (seatNumber) {
      where.seatNumber = { contains: seatNumber, mode: 'insensitive' };
    }
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      
      where.createdAt = {
        gte: startDate,
        lt: endDate,
      };
    }

    const orders = await prisma.order.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error("Failed to fetch orders:", error);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}
