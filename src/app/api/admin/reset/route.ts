import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { upsertMenuItems } from "@/lib/seedData";

export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    await prisma.order.deleteMany({});
    await prisma.complaint.deleteMany({});
    
    await upsertMenuItems(prisma);

    return NextResponse.json({ success: true, message: "Demo data reset successfully" });
  } catch (error) {
    console.error("Failed to reset data:", error);
    return NextResponse.json({ error: "Failed to reset data" }, { status: 500 });
  }
}