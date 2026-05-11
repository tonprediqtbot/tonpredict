import { Decimal } from 'decimal.js';

export interface MarketPools {
  yesPool: string | number | Decimal;
  noPool: string | number | Decimal;
  liquidity: string | number | Decimal;
}

export class BettingEngine {
  /**
   * CPMM Pricing Logic: x * y = k
   * x = YES pool
   * y = NO pool
   * k = constant product (liquidity^2)
   */

  static calculateShares(amount: number | string | Decimal, side: 'YES' | 'NO', pools: MarketPools) {
    const b = new Decimal(amount);
    const x = new Decimal(pools.yesPool);
    const y = new Decimal(pools.noPool);
    
    if (side === 'YES') {
      // New Y = (X * Y) / (X + B)
      // Shares = Y - New Y
      const k = x.mul(y);
      const newX = x.add(b);
      const newY = k.div(newX);
      const shares = y.sub(newY);
      return shares;
    } else {
      // New X = (X * Y) / (Y + B)
      // Shares = X - New X
      const k = x.mul(y);
      const newY = y.add(b);
      const newX = k.div(newY);
      const shares = x.sub(newX);
      return shares;
    }
  }

  static getPrice(side: 'YES' | 'NO', pools: MarketPools) {
    const x = new Decimal(pools.yesPool);
    const y = new Decimal(pools.noPool);
    const total = x.add(y);
    
    if (total.isZero()) return new Decimal(0.5);
    
    if (side === 'YES') {
      return x.div(total);
    } else {
      return y.div(total);
    }
  }

  static getImpliedProbability(pools: MarketPools) {
    const x = new Decimal(pools.yesPool);
    const y = new Decimal(pools.noPool);
    const total = x.add(y);
    
    if (total.isZero()) return { yes: 0.5, no: 0.5 };
    
    return {
      yes: x.div(total).toNumber(),
      no: y.div(total).toNumber()
    };
  }

  /**
   * Estimated Payout if the user wins
   * Since this is a binary market, 1 share = 1 TON on resolution
   */
  static estimatePayout(shares: Decimal) {
    return shares;
  }
}
