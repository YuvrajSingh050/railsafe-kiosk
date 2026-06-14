export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";


export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get("category");

    const where = category && category !== "All" ? { category } : {};

    const items = await prisma.menuItem.findMany({
      where: {
        ...where,
        isAvailable: true,
      },
      orderBy: { category: "asc" },
    });

    return NextResponse.json(items);
  } catch (error) {
    console.error("Failed to fetch menu:", error);
    return NextResponse.json({ error: "Failed to fetch menu items" }, { status: 500 });
  }
}
