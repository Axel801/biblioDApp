const libroNFT = artifacts.require("LibroNFT");
const marketplace = artifacts.require("Marketplace");

module.exports = async function (deployer, network, accounts) {

    // Hacemos que en la migración se añada el Marketplace en la instancia del libro
    // Esto hace que algunos tests anteriores creados den falsos positivos
    let instanceLibro;
    await deployer.deploy(libroNFT, accounts[0]).then((instance) => {
        instanceLibro = instance;
    });
    await deployer.deploy(marketplace, libroNFT.address).then((instance) => {
        instanceLibro.addMarketPlaceAddress(instance.address)
    });
};
