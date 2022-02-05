import { Injectable } from '@angular/core';
import { create as IPFS } from 'ipfs-http-client'

@Injectable({
  providedIn: 'root'
})
export class IpfsService {

  ipfs;
  buffer;
  constructor() {
    this.ipfs = IPFS({
      host: 'ipfs.infura.io',
      port: 5001,
      protocol: 'https'
    });


  };


  async convertToBuffer(reader) {
    return await Buffer.from(reader.result);
  }
  async add(buffer) {

    return await this.ipfs.add(buffer).then(ipfsHash => {
      // console.log("IPFS address:", ipfsHash);
      // console.log('URL: https://ipfs.io/ipfs/' + ipfsHash.path);
      return 'https://ipfs.io/ipfs/' + ipfsHash.path
    }, error => console.log(error)
    );

  }
}