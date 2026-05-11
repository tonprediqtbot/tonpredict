import { NextResponse } from "next/server";
import { prisma } from "@tonbet/database";

export async function GET() {
  try {
    const markets = await prisma.market.findMany({
      where: { resolved: false },
      orderBy: { created_at: "desc" },
    });
    return NextResponse.json(markets);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
