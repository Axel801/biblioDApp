import { Component, OnInit } from '@angular/core';
import { LibroNFTService } from 'src/app/services/libroNFT/libro-nft.service';
import { MenuService } from 'src/app/services/menu/menu.service';
import { WalletService } from 'src/app/services/wallet/wallet.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  books = [];
  menuItems;

  action: string = 'return';
  routeState: any;

  constructor(
    private menuService: MenuService,
    private libroNFTService: LibroNFTService,
    public walletService: WalletService,
  ) {
    this.menuItems = this.menuService.items;
    this.getBooks();
  }

  ngOnInit(): void {
  }

  async getBooks() {

    const balanceUser = await this.libroNFTService.getBalance(this.walletService.address);
    console.log(`User tiene: ${balanceUser}`);


    for (let index = 0; index < balanceUser; index++) {

      const tokenID = await this.libroNFTService.tokenIDOwnerByIndex(this.walletService.address, index);
      const bookURI = await this.libroNFTService.getTokenURI(tokenID);
      // console.log(bookURI);
      const attributes = bookURI.attributes.reduce((a, v) => ({ ...a, [v.trait_type]: v.value }), {})

      this.books.push({
        title: bookURI.name,
        photoURL: bookURI.image_data,
        author: attributes.author,
        synopsis: attributes.synopsis,
        isbn: attributes.isbn,
        tokenID: tokenID

      });
    }

    // this.books = [
    //   {
    //     title: 'El pozo de la ascension',
    //     photoURL: 'https://picsum.photos/380/400',
    //     author: 'Brandom sanderson',
    //     synopsis: 'Lorem ipsum dolor sit amet',
    //     tokenId: '1'
    //   },
    // ];

  }
}
