const PredictionMarket = artifacts.require("PredictionMarket.sol");

const side = {
    BIDEN: 0,
    TRUMP: 1
}

contract("Prediction Market", addresses => {
    [admin, oracle, gambler1, gambler2, gambler3, gambler4, _] = addresses;

    it("Should Work Properly", async ()=> {
        const predictionMarket = await PredictionMarket.new(oracle);

        await predictionMarket.placeBet(side.BIDEN, {from: gambler1, value: web3.utils.toWei('1')});
        await predictionMarket.placeBet(side.BIDEN, {from: gambler2, value: web3.utils.toWei('1')});
        await predictionMarket.placeBet(side.BIDEN, {from: gambler3, value: web3.utils.toWei('2')});
        await predictionMarket.placeBet(side.TRUMP, {from: gambler4, value: web3.utils.toWei('4')});

        await predictionMarket.reportResult(side.BIDEN, side.TRUMP, {from: oracle});

        const balanceBefore = (await Promise.all(
            [gambler1, gambler2, gambler3, gambler4].map(gambler => (
                web3.eth.getBalance(gambler)
            ))
        ))
        .map(balance => web3.utils.toBN(balance));

        await Promise.all(
            [gambler1, gambler2, gambler3].map(gambler => (
                predictionMarket.withdrawGain({from: gambler})
            ))
        );
        const balanceAfter = (await Promise.all(
            [gambler1, gambler2, gambler3, gambler4].map(gambler => (
                web3.eth.getBalance(gambler)
            ))
        ))
        .map(balance => web3.utils.toBN(balance));

        assert(balanceAfter[0].sub(balanceBefore[0]).toString().slice(0, 3) === '199');
        assert(balanceAfter[1].sub(balanceBefore[1]).toString().slice(0, 3) === '199');
        assert(balanceAfter[2].sub(balanceBefore[2]).toString().slice(0, 3) === '399');

        assert(balanceAfter[3].sub(balanceBefore[3]).isZero());
    });
});