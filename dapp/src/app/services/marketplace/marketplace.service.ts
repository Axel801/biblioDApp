import { Injectable } from '@angular/core';
import { WalletService } from '../wallet/wallet.service';
import { Web3Service } from '../web3/web3.service';
const MARKETPLACE_BUILD = require('../../../../contracts/Marketplace.json');

@Injectable({
  providedIn: 'root'
})
export class MarketplaceService {
  // MARKETPLACE_ADDRESS = '0x497fE99548149BffE43D2a21C7dAA2F64Db08493'; //LOCAL
  MARKETPLACE_ADDRESS = '0xf2779c16cDDA7c8f5C840A0Dd3fCea3dB298faDd'; //ROPSTEN
  contract;
  constructor(
    private web3Service: Web3Service,
    private walletService: WalletService
  ) {
    this.contract = new this.web3Service.eth.Contract(MARKETPLACE_BUILD.abi, this.MARKETPLACE_ADDRESS);
  }

  async getTotalBooks() {
    return await this.contract.methods.totalBooks().call();
  }
  async getTotalActiveBooks() {
    return await this.contract.methods.getActiveBooksCount().call();
  }

  async getActiveBookByIndex(_index) {
    return await this.contract.methods.getActiveBooksByIndex(_index).call();
  }
  async getTokenIDByIndex(_index) {
    return await this.contract.methods.booksAvailable(_index).call();
  }

  async rentBook(_tokenID) {
    return await this.contract.methods.rentBook(_tokenID).send({ from: this.walletService.address });
  }

  async returnBook(_tokenID) {
    return await this.contract.methods.returnBook(_tokenID).send({ from: this.walletService.address });
  }

  async booksAvailable(_index) {
    return await this.contract.methods.booksAvailable(_index).call();
  }
}
