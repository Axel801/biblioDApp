import { Component, OnInit } from '@angular/core';
import { NbMenuItem } from '@nebular/theme';
import { LibroNFTService } from 'src/app/services/libroNFT/libro-nft.service';
import { MarketplaceService } from 'src/app/services/marketplace/marketplace.service';
import { MenuService } from 'src/app/services/menu/menu.service';

@Component({
  selector: 'app-library',
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.css']
})
export class LibraryComponent implements OnInit {
  isLibrary;

  books = [];
  menuItems;

  activeBooks;
  action: string = 'rent';

  constructor(private menuService: MenuService,
    private marketPlaceService: MarketplaceService,
    private libroNFTService: LibroNFTService
  ) {
    this.menuItems = this.menuService.items;

    // console.log(this.action);

    this.getBooks();

  }

  ngOnInit(): void {
  }


  async getBooks() {
    this.activeBooks = await this.marketPlaceService.getTotalActiveBooks();
    console.log(`Marketplace tiene libros activos: ${this.activeBooks}`);
    for (let index = 0; index < this.activeBooks; index++) {
      const indexActive = await this.marketPlaceService.getActiveBookByIndex(index);
      const bookStruct = await this.marketPlaceService.booksAvailable(indexActive);
      const bookURI = await this.libroNFTService.getTokenURI(bookStruct.tokenID);
      // console.log(bookURI);
      const attributes = bookURI.attributes.reduce((a, v) => ({ ...a, [v.trait_type]: v.value }), {})

      this.books.push({
        title: bookURI.name,
        photoURL: bookURI.image_data,
        author: attributes.author,
        synopsis: attributes.synopsis,
        isbn: attributes.isbn,
        tokenID: bookStruct.tokenID

      });
    }
    // this.books = [
    //   {
    //     title: 'El nombre del viento',
    //     photoURL: 'https://picsum.photos/380/400',
    //     author: 'Patrick',
    //     synopsis: 'Lorem ipsum dolor sit amet',
    //     tokenId: '1'
    //   },
    // ];
  }

  rentBook(_tokenID) {
    console.log(_tokenID);

  }

}
