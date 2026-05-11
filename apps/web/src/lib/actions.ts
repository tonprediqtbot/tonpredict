"use server";

import { prisma } from "@tonbet/database";

export async function getMarkets() {
  try {
    const markets = await prisma.market.findMany({
      where: { resolved: false },
      orderBy: { created_at: "desc" },
      include: {
        _count: {
          select: { bets: true }
        }
      }
    });
    return { success: true, data: markets };
  } catch (error: any) {
    console.error("Error fetching markets:", error.message);
    return { success: false, error: "Failed to load markets" };
  }
}

export async function getUserProfile(telegramId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { telegram_id: telegramId },
      include: {
        bets: {
          include: { market: true }
        }
      }
    });
    return { success: true, data: user };
  } catch (error: any) {
    console.error("Error fetching user profile:", error.message);
    return { success: false, error: "Failed to load profile" };
  }
}
