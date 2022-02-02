const Marketplace = artifacts.require("Marketplace");
const LibroNFT = artifacts.require("LibroNFT");
/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */

const getReason = (error) => {
  return error.data[Object.keys(error.data)[0]].reason;
}

let marketplace;
let libroNFT;

contract("Marketplace", function (accounts) {

  before(async () => {
    await LibroNFT.deployed().then(instancia => { libroNFT = instancia });
    await Marketplace.deployed().then(instancia => { marketplace = instancia });
  });

  it("Marketplace deployed", async function () {
    await Marketplace.deployed();
    return assert.isTrue(true);
  });

  it('Total books', async () => {
    const balance = await marketplace.totalBooks().then(r => r.toNumber());
    assert(balance == 0);
  });

  it('Add marketPlace address into LibroNFT contract', async () => {
    await libroNFT.addMarketPlaceAddress(marketplace.address);
    const marketPlaceAddress = await libroNFT.marketplaceAddress();
    return assert(marketPlaceAddress == marketplace.address);
  });

  it('LibroNFT minted new book and transfer into marketplace', async () => {
    const startBalance = await marketplace.totalBooks().then(r => r.toNumber());
    await libroNFT.safeMint('Titulo 1', 'Autor 1', 'foto1', 'sinopsis1', 'ISBN1');
    const endBalance = await marketplace.totalBooks().then(r => r.toNumber());
    return assert(startBalance + 1 == endBalance);
  });

  it('Get total active books', async () => {
    const total = await marketplace.getActiveBooksCount().then(r => r.toNumber());
    assert(total == 1); //Es uno porque nos devuelve la longitud
  });

  it('Get active book by index', async () => {
    const total = await marketplace.getActiveBooksByIndex(1); //Decimos que queremos que nos traiga la primera ocurrencia
    assert(total == 0);// El indice de booksAvailable es 0
  });

  it('Get LibroNFT by marketplace index books available', async () => {
    const libroMarketPlace = await marketplace.booksAvailable(0); // Indice del test anterior
    const tokenID = libroMarketPlace.tokenID.toNumber();
    const encodeURI = await libroNFT.tokenURI(tokenID);
    // Para que al decodificar añada correctamente las tildes
    const json = decodeURIComponent(atob(encodeURI.substr(29)).split('').map((c) => {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));// 29 = length of "data:application/json;base64,"
    const result = JSON.parse(json);
    assert(result.name == 'Titulo 1');
  });

  it('Get Index by TokenID', async () => {
    const index = await marketplace.getIndexByTokenID(0).then(r => r.toNumber());
    assert(index == 0);
  });

  it('Rent book in marketplace', async () => {
    const tokenID = 0;
    const startBalance = await libroNFT.balanceOf(accounts[0]).then(r => r.toNumber());
    await marketplace.rentBook(tokenID, { from: accounts[0] }); //TokenID del libro del anterior test
    const endBalance = await libroNFT.balanceOf(accounts[0]).then(r => r.toNumber());
    assert(startBalance + 1 == endBalance);
  });

  it('Return book to marketplace', async () => {
    const totalActive = await marketplace.getActiveBooksCount().then(r => r.toNumber());
    const tokenId = await libroNFT.tokenOfOwnerByIndex(accounts[0], 0); // El primer libro que encuentre que tenga el usuario.
    await marketplace.returnBook(tokenId, { from: accounts[0] });
    const totalActiveEnd = await marketplace.getActiveBooksCount().then(r => r.toNumber());
    assert(totalActive + 1 == totalActiveEnd);
  });

});
