import { NextResponse } from "next/server";
import { prisma } from "@tonbet/database";

export async function POST(req: Request) {
  try {
    const { userId, marketId, side, amount, txHash } = await req.json();

    // 1. Create the Bet record
    const bet = await prisma.bet.create({
      data: {
        user_id: userId,
        market_id: marketId,
        side,
        amount: parseFloat(amount),
        shares: parseFloat(amount), // Simplified for now
      },
    });

    // 2. Record the transaction
    await prisma.transaction.create({
      data: {
        user_id: userId,
        amount: parseFloat(amount),
        tx_hash: txHash,
        type: "BET",
      }
    });

    // 3. Increment market volume
    await prisma.market.update({
      where: { id: marketId },
      data: {
        total_volume: {
          increment: parseFloat(amount),
        }
      }
    });

    return NextResponse.json({ success: true, bet });
  } catch (error: any) {
    console.error("Bet Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
