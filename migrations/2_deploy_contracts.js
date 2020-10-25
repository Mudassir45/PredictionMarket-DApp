const PredictionMarket = artifacts.require("PredictionMarket.sol");

module.exports = async function (deployer, network, addresses) {
    const [admin, oracle, gambler1, gambler2, gambler3, gambler4, _] = addresses;
    await deployer.deploy(PredictionMarket, oracle);
};