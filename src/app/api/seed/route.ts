import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { upsertMenuItems } from "@/lib/seedData";

export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    await upsertMenuItems(prisma);
    return NextResponse.json({ success: true, message: "Menu items seeded successfully" });
  } catch (error) {
    console.error("Failed to seed data:", error);
    return NextResponse.json({ error: "Failed to seed data" }, { status: 500 });
  }
}
