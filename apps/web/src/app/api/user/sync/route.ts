import { NextResponse } from "next/server";
import { prisma } from "@tonbet/database";

export async function POST(req: Request) {
  try {
    const { telegram_id, username, firstName, referred_by } = await req.json();

    if (!telegram_id) {
      return NextResponse.json({ error: "telegram_id is required" }, { status: 400 });
    }

    // 1. Upsert User
    const user = await prisma.user.upsert({
      where: { telegram_id: telegram_id.toString() },
      update: {
        username: username || null,
      },
      create: {
        telegram_id: telegram_id.toString(),
        username: username || null,
        referral_code: Math.random().toString(36).substring(2, 8).toUpperCase(),
        referred_by: referred_by || null,
      },
    });

    return NextResponse.json({ success: true, data: user });
  } catch (error: any) {
    console.error("[API User Sync Error]:", error);
    return NextResponse.json({ error: "Failed to sync user" }, { status: 500 });
  }
}
