import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Web3Service } from '../web3/web3.service';
declare var window: any
@Injectable({
  providedIn: 'root'
})
export class WalletService {

  address;
  web3;
  wallet;
  constructor(
    private web3Service: Web3Service,
    private cookieService: CookieService) {

    if (this.cookieService.get('address') != '') {
      this.initWallet(this.cookieService.get('address'));
    }
  }

  async metamaskInit() {
    if (window.ethereum) {
      try {
        let accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        this.initWallet(accounts[0]);
      } catch (e) {
        console.log(e);
      }
    } else {
      alert('Install Metamask');
    }
  }

  initWallet(_address) {
    this.address = _address;
    this.cookieService.set('address', this.address);
  }

  getBalance() {
    return this.web3Service.eth.getBalance(this.address).then(this.web3Service.utils.fromWei);
  }
}
