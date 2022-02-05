import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LibroNFTService } from 'src/app/services/libroNFT/libro-nft.service';
import { WalletService } from 'src/app/services/wallet/wallet.service';
import { Web3Service } from 'src/app/services/web3/web3.service';

declare var window: any

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(
    private walletService: WalletService,
    private web3Service: Web3Service,
    private libroNFT: LibroNFTService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  async connect() {
    await this.walletService.metamaskInit().then(() => {
      this.router.navigate(['/']);
    });


  }
}
