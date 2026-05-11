import { NextResponse } from "next/server";
import { prisma } from "@tonbet/database";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const market = await prisma.market.findUnique({
      where: { id },
      include: {
        creator: {
          select: { username: true, telegram_id: true }
        },
        _count: {
          select: { bets: true, comments: true }
        },
        bets: {
          take: 10,
          orderBy: { created_at: "desc" },
          include: {
            user: { select: { username: true, telegram_id: true } }
          }
        }
      }
    });

    if (!market) {
      return NextResponse.json({ error: "Market not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: market });
  } catch (error: any) {
    console.error("[API Market Detail Error]:", error);
    return NextResponse.json({ error: "Failed to fetch market details" }, { status: 500 });
  }
}
