import { Component, Input, OnInit } from '@angular/core';
import { LibroNFTService } from 'src/app/services/libroNFT/libro-nft.service';
import { MarketplaceService } from 'src/app/services/marketplace/marketplace.service';
import { WalletService } from 'src/app/services/wallet/wallet.service';


@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit {

  @Input() book?;
  @Input() action;

  textButton: string = '';
  constructor(
    private libroNFTService: LibroNFTService,
    private marketplaceService: MarketplaceService,
    private walletService: WalletService
  ) { }

  ngOnInit(): void {
    // console.log(this.action);
    this.textButton = this.action == 'rent' ? 'Alquilar' : 'Devolver';
  }

  async doAction(_tokenID) {
    switch (this.action) {
      case 'rent':
        await this.marketplaceService.rentBook(_tokenID).then(console.log);
        break;
      case 'return':
        const ownerTokenID = await this.libroNFTService.ownerOf(_tokenID);
        console.log(
          await this.marketplaceService.returnBook(_tokenID).then(console.log)
        );
        break;
    }
  }
}
