import { NextResponse } from "next/server";
import { prisma } from "@tonbet/database";
import { BettingEngine } from "@/lib/betting-engine";
import { Decimal } from "decimal.js";
import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

export async function POST(req: Request) {
  try {
    const { marketId, userId, side, amount, txHash } = await req.json();

    if (!marketId || !userId || !side || !amount) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // 1. Fetch Market and Validate
    const market = await prisma.market.findUnique({
      where: { id: marketId },
      include: { _count: { select: { bets: true } } }
    });

    if (!market || market.resolved) {
      return NextResponse.json({ error: "Market not found or resolved" }, { status: 404 });
    }

    if (new Date() > market.endDate) {
      return NextResponse.json({ error: "Market has ended" }, { status: 400 });
    }

    // 2. Calculate Shares using Betting Engine (CPMM)
    const shares = BettingEngine.calculateShares(amount, side as 'YES' | 'NO', {
      yesPool: market.yesPool.toString(),
      noPool: market.noPool.toString(),
      liquidity: market.liquidity.toString()
    });

    // 3. Database Transaction: Atomic Update
    const result = await prisma.$transaction(async (tx) => {
      // A. Create the Bet
      const bet = await tx.bet.create({
        data: {
          marketId,
          userId,
          side,
          amount: new Decimal(amount),
          shares: shares,
          txHash
        }
      });

      // B. Update Market Pools
      const updatedMarket = await tx.market.update({
        where: { id: marketId },
        data: {
          yesPool: side === 'YES' ? { increment: new Decimal(amount) } : market.yesPool,
          noPool: side === 'NO' ? { increment: new Decimal(amount) } : market.noPool,
          totalVolume: { increment: new Decimal(amount) }
        }
      });

      // C. Update or Create User Position
      const existingPosition = await tx.position.findUnique({
        where: {
          userId_marketId_side: { userId, marketId, side }
        }
      });

      if (existingPosition) {
        const totalShares = new Decimal(existingPosition.shares).add(shares);
        // Weighted average price
        const totalCost = new Decimal(existingPosition.shares).mul(existingPosition.avgPrice).add(new Decimal(amount));
        const newAvgPrice = totalCost.div(totalShares);

        await tx.position.update({
          where: { id: existingPosition.id },
          data: {
            shares: totalShares,
            avgPrice: newAvgPrice
          }
        });
      } else {
        await tx.position.create({
          data: {
            userId,
            marketId,
            side,
            shares: shares,
            avgPrice: new Decimal(amount).div(shares)
          }
        });
      }

      // D. Log Transaction
      await tx.transaction.create({
        data: {
          userId,
          type: "BET",
          amount: new Decimal(amount),
          status: "COMPLETED",
          txHash
        }
      });

      return { bet, updatedMarket };
    });

    // 4. Broadcast Real-time Update via Redis
    try {
      await redis.publish("market_updates", JSON.stringify({
        marketId,
        type: "NEW_BET",
        side,
        amount,
        newPools: {
          yes: result.updatedMarket.yesPool.toString(),
          no: result.updatedMarket.noPool.toString()
        }
      }));
    } catch (e) {
      console.error("Redis Publish Error:", e);
    }

    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    console.error("[API Bet Error]:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
