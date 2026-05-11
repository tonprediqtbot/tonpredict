import { NextResponse } from "next/server";
import { prisma } from "@tonbet/database";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const limit = parseInt(searchParams.get("limit") || "20");
    const sort = searchParams.get("sort") || "newest";

    const where: any = { resolved: false };
    if (category && category !== "all") {
      where.category = category;
    }

    const markets = await prisma.market.findMany({
      where,
      take: limit,
      orderBy: sort === "newest" ? { created_at: "desc" } : { totalVolume: "desc" },
      include: {
        _count: {
          select: { bets: true, comments: true }
        }
      }
    });

    return NextResponse.json({ success: true, data: markets });
  } catch (error: any) {
    console.error("[API Markets Error]:", error);
    return NextResponse.json({ error: "Failed to fetch markets" }, { status: 500 });
  }
}
