import { NextResponse } from "next/server";
import { prisma } from "@tonbet/database";
import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

export async function POST(req: Request) {
  try {
    const { title, description, image, category, resolutionSource, endDate, creatorId, initialLiquidity } = await req.json();

    // 1. Validation
    if (!title || !description || !category || !endDate || !creatorId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const marketEndDate = new Date(endDate);
    if (marketEndDate <= new Date()) {
      return NextResponse.json({ error: "End date must be in the future" }, { status: 400 });
    }

    // 2. Check for Duplicates
    const existing = await prisma.market.findFirst({
      where: { title: { equals: title, mode: 'insensitive' } }
    });
    if (existing) {
      return NextResponse.json({ error: "A market with this title already exists" }, { status: 400 });
    }

    // 3. Create Market with Initial Liquidity
    // Default yes/no pools to liquidity/2 to start at 50/50 odds
    const liquidity = parseFloat(initialLiquidity || "10"); 
    const poolSize = liquidity / 2;

    const market = await prisma.market.create({
      data: {
        title,
        description,
        image,
        category,
        resolutionSource,
        endDate: marketEndDate,
        creatorId,
        liquidity: liquidity,
        yesPool: poolSize,
        noPool: poolSize,
        totalVolume: 0
      }
    });

    // 4. Broadcast New Market
    try {
      await redis.publish("market_updates", JSON.stringify({
        type: "NEW_MARKET",
        marketId: market.id,
        market
      }));
    } catch (e) {
      console.error("Redis Publish Error:", e);
    }

    return NextResponse.json({ success: true, data: market });
  } catch (error: any) {
    console.error("[API Market Create Error]:", error);
    return NextResponse.json({ error: "Failed to create market" }, { status: 500 });
  }
}
