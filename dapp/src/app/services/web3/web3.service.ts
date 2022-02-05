import { Injectable } from '@angular/core';
import Web3 from 'web3';
declare var window: any
@Injectable({
  providedIn: 'root'
})
export class Web3Service {

  eth;
  utils;
  web3;

  constructor() {
    const web3 = new Web3(window.ethereum);
    this.eth = web3.eth;
    this.utils = web3.utils;

    try {
      this.enableEthereum();

    } catch (error) {
      // user rejected permission

      console.log('user rejected permission');
    }

  }
  private async enableEthereum() {



    const chainIDLocalHost = await this.utils.numberToHex(3);
    const networkID = window.ethereum.networkVersion;

    //No funciona correctamente en network local
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `${chainIDLocalHost}` }], // chainId must be in hexadecimal numbers
      });
    } catch (error: any) {
      // This error code indicates that the chain has not been added to MetaMask
      // if it is not, then install it into the user MetaMask
      // if (error.code === 4902) {
      //   try {
      //     await window.ethereum.request({
      //       method: 'wallet_addEthereumChain',
      //       params: [
      //         {
      //           "name": "Ethereum Testnet Ropsten",
      //           "chainId": 3,
      //           "shortName": "rop",
      //           "chain": "ETH",
      //           "network": "ropsten",
      //           "networkId": 3,
      //           "nativeCurrency": {"name":"Ropsten Ether","symbol":"ROP","decimals":18},
      //           "rpc": ["https://ropsten.infura.io/v3/${INFURA_API_KEY}","wss://ropsten.infura.io/ws/v3/${INFURA_API_KEY}"],
      //           "faucets": ["https://faucet.ropsten.be?${ADDRESS}"],
      //           "infoURL": "https://github.com/ethereum/ropsten"
      //         },
      //       ],
      //     });
      //   } catch (addError) {
      //     console.error(addError);
      //   }
      // }
      console.error(error);
    }
    await window.ethereum.enable();

  }
  async getTx(tx) {
    return this.eth.getTransactionReceipt(tx).then(receipt => receipt);
  }
}
