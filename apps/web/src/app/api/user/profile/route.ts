import { NextResponse } from "next/server";
import { prisma } from "@tonbet/database";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id"); // telegram_id

    if (!id) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { telegram_id: id },
      include: {
        positions: {
          include: { market: true }
        },
        _count: {
          select: { bets: true, referrals: true }
        }
      }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: user });
  } catch (error: any) {
    console.error("[API User Profile Error]:", error);
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
  }
}
