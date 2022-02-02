const LibroNFT = artifacts.require("LibroNFT");
const Marketplace = artifacts.require('Marketplace');


const CODE_ACCOUNT_1_NOT_ROLE_LIBRARIAN = "AccessControl: account 0xe1b20fec10c14b5fb672ba7c18f00eb03fdc8023 is missing role 0x318e0d99f5c898fe76545d6edd3bbf2ceea8ef1f22f2d106edb372a9e051598b";

const CODE_ACCOUNT_1_NOT_ROLE_ADMIN = "AccessControl: account 0xe1b20fec10c14b5fb672ba7c18f00eb03fdc8023 is missing role 0x0000000000000000000000000000000000000000000000000000000000000000"

const ERROR_TRANSFER_NO_MARKETPLACE = "Solo puede haber transferencias dentro del marketplaceAddress";

const getReason = (error) => {
    return error.data[Object.keys(error.data)[0]].reason;
}


let libroNFT;
let marketplace;
let MARKETPLACE_ADDRESS;
contract("LibroNFT", function (accounts) {


    before(async () => {
        await LibroNFT.deployed().then(instancia => { libroNFT = instancia });
        await Marketplace.deployed().then(instancia => { marketplace = instancia });
    });

    it("LibroNFT deployed", async function () {
        await LibroNFT.deployed();
        return assert.isTrue(true);
    });

    it("Marketplace deployed", async function () {
        await Marketplace.deployed();
        MARKETPLACE_ADDRESS = Marketplace.address;
        return assert.isTrue(true);
    })


    /*
    ---------------------AccessGuard---------------------
    */

    it('Account0 is librarianRole', async () => {
        const isBibliotecario = await libroNFT.isLibrarian(accounts[0]);
        return assert(isBibliotecario);
    });

    it("Account1 isn't librarianRole", async () => {
        const isBibliotecario = await libroNFT.isLibrarian(accounts[1]);
        return assert(!isBibliotecario);
    });

    it("Add new librarianRole", async () => {
        const isNotBibliotecarioStart = await libroNFT.isLibrarian(accounts[1]);
        await libroNFT.addLibrarian(accounts[1]);
        const isBibliotecarioStart = await libroNFT.isLibrarian(accounts[1]);
        return assert(!isNotBibliotecarioStart == isBibliotecarioStart);
    });

    it("Remove librarianRole", async () => {
        const isBibliotecarioStart = await libroNFT.isLibrarian(accounts[1]);
        await libroNFT.revokeLibrarian(accounts[1]);
        const isNotBibliotecarioStart = await libroNFT.isLibrarian(accounts[1]);
        return assert(!isNotBibliotecarioStart == isBibliotecarioStart);
    });

    it("User can't add librarianRole", async () => {
        try {
            await libroNFT.addLibrarian(accounts[1], { from: accounts[1] }).then(() => {
                assert(false, 'Los usuarios no pueden asignar bibliotecarios');
            });
        } catch (error) {
            const reason = getReason(error);
            return assert.isTrue(reason == CODE_ACCOUNT_1_NOT_ROLE_LIBRARIAN);
        }
    });

    it("User can't remove librarianRole", async () => {
        try {
            await libroNFT.revokeLibrarian(accounts[1], { from: accounts[1] }).then(() => {
                assert(false, 'Los usuarios no pueden eliminar bibliotecarios');
            });
        } catch (error) {
            const reason = getReason(error);
            return assert.isTrue(reason == CODE_ACCOUNT_1_NOT_ROLE_LIBRARIAN);
        }
    });

    it('Add new adminRole', async () => {
        const DEFAULT_ADMIN_ROLE = await libroNFT.DEFAULT_ADMIN_ROLE();
        const isNotAdminStart = await libroNFT.hasRole(DEFAULT_ADMIN_ROLE, accounts[1], { from: accounts[1] });
        await libroNFT.addAdmin(accounts[1]);
        const isAdminStart = await libroNFT.hasRole(DEFAULT_ADMIN_ROLE, accounts[1], { from: accounts[1] });
        return assert(!isNotAdminStart == isAdminStart);
    });

    it('Renounce adminRole', async () => {
        const DEFAULT_ADMIN_ROLE = await libroNFT.DEFAULT_ADMIN_ROLE();
        await libroNFT.renounceRole(DEFAULT_ADMIN_ROLE, accounts[1], { from: accounts[1] });
        const isAdmin = await libroNFT.hasRole(DEFAULT_ADMIN_ROLE, accounts[1], { from: accounts[1] });
        return assert(!isAdmin);
    });

    it('Renounce adminRole from acc0', async () => {
        const DEFAULT_ADMIN_ROLE = await libroNFT.DEFAULT_ADMIN_ROLE();
        try {
            await libroNFT.renounceRole(DEFAULT_ADMIN_ROLE, accounts[1], { from: accounts[0] }).then(() => {
                assert(false, 'No debería otro admin eliminar a un admin');
            });
        } catch (error) {
            const reason = getReason(error);
            assert(reason == 'AccessControl: can only renounce roles for self');
        }
    });

    it('Renounce adminRole from user', async () => {
        const DEFAULT_ADMIN_ROLE = await libroNFT.DEFAULT_ADMIN_ROLE();
        try {
            await libroNFT.renounceRole(DEFAULT_ADMIN_ROLE, accounts[1], { from: accounts[2] }).then(() => {
                assert(false, 'No debería un user eliminar a un admin');
            });
        } catch (error) {
            const reason = getReason(error);
            assert(reason == 'AccessControl: can only renounce roles for self');
        }
    });

    it("User can't add newAdmin", async () => {
        try {
            await libroNFT.addAdmin(accounts[1], { from: accounts[1] }).then(() => {
                assert(false, 'Los usuarios no pueden asignar administradores');
            });
        } catch (error) {
            const reason = getReason(error);
            return assert.isTrue(reason == CODE_ACCOUNT_1_NOT_ROLE_ADMIN);
        }
    });

    /*
    ---------------------Marketplace---------------------
    */

    // it('safeTransferFrom NFT without marketAddress added', async () => {
    //     try {
    //         await libroNFT.safeTransferFrom(accounts[0], accounts[1], 0).then(() => {
    //             assert(false, 'No se debería poder enviar a otro user');
    //         });
    //     } catch (error) {
    //         const reason = getReason(error);
    //         assert(reason == 'Tiene que existir un marketplaceAddress');
    //     }
    // });

    // it('transferFrom NFT without marketAddress added', async () => {
    //     try {
    //         await libroNFT.transferFrom(accounts[0], accounts[1], 0).then(() => {
    //             assert(false, 'No se debería poder enviar a otro user');
    //         });
    //     } catch (error) {
    //         const reason = getReason(error);
    //         assert(reason == 'Tiene que existir un marketplaceAddress');
    //     }
    // });

    it('User try add MarketPlaceAddress', async () => {
        try {
            await libroNFT.addMarketPlaceAddress(MARKETPLACE_ADDRESS, { from: accounts[1] }).then(() => {
                assert(false, 'Usuario no debería poder modificar este valor');
            });
        } catch (error) {
            const reason = getReason(error);
            return assert(reason == CODE_ACCOUNT_1_NOT_ROLE_ADMIN);
        }
    });

    it('Admin add MarketPlaceAddress', async () => {
        await libroNFT.addMarketPlaceAddress(MARKETPLACE_ADDRESS);
        const marketPlaceAddress = await libroNFT.marketplaceAddress();
        return assert(marketPlaceAddress == MARKETPLACE_ADDRESS);
    });


    /*
    -------------------------Mint-------------------------
    */

    it("User can't mint", async () => {
        try {
            await libroNFT.safeMint('Titulo 2', 'Autor 2', 'foto2', 'sinopsis2', 'ISBN2', { from: accounts[1] }).then(() => {
                return assert(false, 'No debería poder mintear NFTs');
            });

        } catch (error) {
            const reason = getReason(error);
            return assert.isTrue(reason == CODE_ACCOUNT_1_NOT_ROLE_LIBRARIAN);
        }
    });

    it("librarianRole can mint", async () => {
        const startBalanceOfNFT = await libroNFT.balanceOf(MARKETPLACE_ADDRESS).then(r => r.toNumber());
        await libroNFT.safeMint('Titulo 1', 'Autor 1', 'foto1', 'sinopsis1', 'ISBN1');
        const endBalanceOfNFT = await libroNFT.balanceOf(MARKETPLACE_ADDRESS).then(r => r.toNumber());
        return assert(startBalanceOfNFT + 1 == endBalanceOfNFT);
    });

    it('safeTransferFrom NFT with marketAddress to other user account', async () => {
        const tokenId = await libroNFT.tokenByIndex(0);
        try {
            await libroNFT.safeTransferFrom(accounts[0], accounts[1], tokenId).then(() => {
                assert(false, 'No se debería poder enviar a otro user');
            });
        } catch (error) {
            const reason = getReason(error);
            assert(reason == ERROR_TRANSFER_NO_MARKETPLACE);
        }
    });

    it('transferFrom NFT with marketAddress to other user account', async () => {
        const tokenId = await libroNFT.tokenByIndex(0);
        try {
            await libroNFT.transferFrom(accounts[0], accounts[1], tokenId).then(() => {
                assert(false, 'No se debería poder enviar a otro user');
            });
        } catch (error) {
            const reason = getReason(error);
            assert(reason == ERROR_TRANSFER_NO_MARKETPLACE);
        }
    });

    it('TokenID NOT exists', async () => {
        const status = await libroNFT.existTokenID(99);
        assert(status == false);
    });

    it('TokenID exists', async () => {
        const status = await libroNFT.existTokenID(0);
        assert(status == true);
    });

    //No se pueden porque hemos bloqueado las transferencias entre personal address

    // it('safeTransferFrom v1 NFT with marketAddress ', async () => {
    //   await libroNFT.safeMint(accounts[0], 'Titulo 2', 'Autor 2', 'foto2', 'sinopsis2', 'ISBN2');
    //   const quantityBeforeTransfer = await libroNFT.balanceOf(MARKETPLACE_ADDRESS).then(r => r.toNumber());
    //   const tokenId = await libroNFT.tokenByIndex(0);
    //   await libroNFT.safeTransferFrom(accounts[0], MARKETPLACE_ADDRESS, tokenId);
    //   const quantity = await libroNFT.balanceOf(MARKETPLACE_ADDRESS).then(r => r.toNumber());
    //   assert(quantityBeforeTransfer + 1 == quantity);
    // });

    // it('transferFrom v1 NFT with marketAddress ', async () => {
    //   await libroNFT.safeMint('Titulo 2', 'Autor 2', 'foto2', 'sinopsis2', 'ISBN2');
    //   const quantityMarketPlaceBeforeTransfer = await libroNFT.balanceOf(MARKETPLACE_ADDRESS).then(r => r.toNumber());
    //   const tokenId = await libroNFT.tokenOfOwnerByIndex(accounts[0], 0);
    //   await libroNFT.transferFrom(accounts[0], MARKETPLACE_ADDRESS, tokenId);
    //   const quantityAfterTransfer = await libroNFT.balanceOf(MARKETPLACE_ADDRESS).then(r => r.toNumber());
    //   assert(quantityMarketPlaceBeforeTransfer + 1 == quantityAfterTransfer);
    // });


});

