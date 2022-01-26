const libroNFT = artifacts.require("LibroNFT");
const marketplace = artifacts.require("Marketplace");

module.exports = async function (deployer, network, accounts) {
    await deployer.deploy(libroNFT, accounts[0]);
    await deployer.deploy(marketplace, libroNFT.address);
};
