import "@stdlib/deploy";
import "./market.tact";

message CreateMarket {
    marketId: String;
    title: String;
    endTime: Int;
}

contract MarketFactory with Deployable {
    owner: Address;
    marketCount: Int as uint32;
    feePercentage: Int as uint16; // e.g. 200 = 2%

    init() {
        self.owner = sender();
        self.marketCount = 0;
        self.feePercentage = 200;
    }

    receive(msg: CreateMarket) {
        require(sender() == self.owner, "Only owner can create markets");
        
        // Calculate the address of the new market
        let init: StateInit = initOf BinaryMarket(myAddress(), msg.marketId, msg.endTime);
        let marketAddress: Address = contractAddress(init);

        // Deploy the new market contract
        send(SendParameters{
            to: marketAddress,
            value: 0,
            mode: SendRemainingValue,
            bounce: false,
            body: Deploy{queryId: 0}.toCell(),
            code: init.code,
            data: init.data
        });

        self.marketCount = self.marketCount + 1;
    }

    receive("emergencyPause") {
        require(sender() == self.owner, "Only owner can pause");
        // implement pause logic
    }
}
