import { NextResponse } from "next/server";
import { prisma } from "@tonbet/database";
import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

export async function POST(req: Request) {
  try {
    const { marketId, outcome, adminId, evidenceUrl } = await req.json();

    if (!marketId || !outcome || !adminId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (outcome !== "YES" && outcome !== "NO") {
      return NextResponse.json({ error: "Invalid outcome. Must be YES or NO" }, { status: 400 });
    }

    // 1. Fetch and Validate
    const market = await prisma.market.findUnique({
      where: { id: marketId }
    });

    if (!market) {
      return NextResponse.json({ error: "Market not found" }, { status: 404 });
    }

    if (market.resolved) {
      return NextResponse.json({ error: "Market already resolved" }, { status: 400 });
    }

    // 2. Resolve Market
    const result = await prisma.$transaction(async (tx) => {
      const updatedMarket = await tx.market.update({
        where: { id: marketId },
        data: {
          resolved: true,
          outcome: outcome
        }
      });

      const resolution = await tx.marketResolution.create({
        data: {
          marketId,
          outcome,
          resolvedBy: adminId,
          evidenceUrl
        }
      });

      // Create admin action log
      await tx.adminAction.create({
        data: {
          adminId,
          action: "RESOLVE_MARKET",
          targetType: "MARKET",
          targetId: marketId
        }
      });

      return { updatedMarket, resolution };
    });

    // 3. Broadcast Resolution
    try {
      await redis.publish("market_updates", JSON.stringify({
        type: "MARKET_RESOLVED",
        marketId,
        outcome
      }));
    } catch (e) {
      console.error("Redis Publish Error:", e);
    }

    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    console.error("[API Market Resolve Error]:", error);
    return NextResponse.json({ error: "Failed to resolve market" }, { status: 500 });
  }
}
