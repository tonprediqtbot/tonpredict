import "@stdlib/deploy";

message PlaceBet {
    side: Bool; // true for YES, false for NO
}

message ResolveMarket {
    outcome: Bool; // true for YES, false for NO
}

message ClaimWinnings {
    // empty for now
}

contract BinaryMarket with Deployable {
    factory: Address;
    marketId: String;
    endTime: Int as uint32;
    resolved: Bool;
    outcome: Bool;
    
    yesPool: Int as coins;
    noPool: Int as coins;

    init(factory: Address, marketId: String, endTime: Int) {
        self.factory = factory;
        self.marketId = marketId;
        self.endTime = endTime;
        self.resolved = false;
        self.outcome = false;
        self.yesPool = 0;
        self.noPool = 0;
    }

    receive(msg: PlaceBet) {
        require(now() < self.endTime, "Market is closed");
        require(!self.resolved, "Market is already resolved");
        
        let ctx: Context = context();
        let amount: Int = ctx.value;
        
        // 2% fee goes to treasury/factory
        let fee: Int = amount * 2 / 100;
        let betAmount: Int = amount - fee;

        if (msg.side) {
            self.yesPool = self.yesPool + betAmount;
        } else {
            self.noPool = self.noPool + betAmount;
        }

        // Send fee to factory
        send(SendParameters{
            to: self.factory,
            value: fee,
            mode: SendIgnoreErrors,
            bounce: false,
            body: "fee".asComment()
        });
    }

    receive(msg: ResolveMarket) {
        require(sender() == self.factory, "Only factory can resolve");
        require(!self.resolved, "Already resolved");
        require(now() >= self.endTime, "Market not ended");

        self.resolved = true;
        self.outcome = msg.outcome;
    }

    receive(msg: ClaimWinnings) {
        require(self.resolved, "Market not resolved");
        // Simplified claim logic
        // Need to implement a proper map of user stakes to calculate payout
    }
}
