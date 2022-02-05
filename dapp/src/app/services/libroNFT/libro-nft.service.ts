import { Injectable } from '@angular/core';
import { WalletService } from '../wallet/wallet.service';
import { Web3Service } from '../web3/web3.service';
const LIBRONFT_BUILD = require('../../../../contracts/LibroNFT.json');

@Injectable({
  providedIn: 'root'
})
export class LibroNFTService {
  // LIBRONFT_ADDRESS = '0xCd4B069b35962dfe3de52Ed6e50E02c4D14Ea87E'; //LOCAL
  LIBRONFT_ADDRESS = '0xa977E1F5684971403A10D05b893f72CccA96b5f8'; //ROPSTEN
  contract;
  constructor(
    private web3Service: Web3Service,
    private walletService: WalletService
  ) {
    this.contract = new this.web3Service.eth.Contract(LIBRONFT_BUILD.abi, this.LIBRONFT_ADDRESS);
  }

  async getBalance(
    _address
  ) {
    return await this.contract.methods.balanceOf(_address).call();
  }

  async getTokenURI(_tokenID) {
    const encodeURI = await this.contract.methods.tokenURI(_tokenID).call();
    const json = decodeURIComponent(atob(encodeURI.substr(29)).split('').map(function (c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));// 29 = length of "data:application/json;base64,"
    return JSON.parse(json);
  }

  async addLibrarianRole(_address) {
    await this.contract.methods.addLibrarian(_address).call();
  }

  async isLibrarian(_address = this.walletService.address) {
    return await this.contract.methods.isLibrarian(_address).call();
  }

  async addMarketPlaceAddress(_addressMarketPlace) {
    await this.contract.methods.addMarketPlaceAddress(_addressMarketPlace).call();
  }

  async mintNewBook(_title, _author, _photoURL, _synopsis, _isbn) {
    await this.contract.methods.safeMint(_title, _author, _photoURL, _synopsis, _isbn).send({ from: this.walletService.address });
  }

  async tokenIDOwnerByIndex(_address, _index) {
    return await this.contract.methods.tokenOfOwnerByIndex(_address, _index).call();
  }

  async ownerOf(_tokenID) {
    return await this.contract.methods.ownerOf(_tokenID).call();
  }

}
