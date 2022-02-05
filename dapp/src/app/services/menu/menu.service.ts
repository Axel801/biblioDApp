import { Injectable } from '@angular/core';
import { NbMenuItem, NbMenuService } from '@nebular/theme';
import { LibroNFTService } from '../libroNFT/libro-nft.service';
import { WalletService } from '../wallet/wallet.service';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  items: NbMenuItem[];
  constructor(
    private nbMenuService: NbMenuService,
    private libroNFTService: LibroNFTService,

  ) {
    this.items = [
      {
        title: 'Alquilar',
        icon: 'book',
        link: '/',
        // url: '/',
      },
      {
        title: 'Mios',
        link: '/profile',
        icon: 'award-outline'
      },
    ];
    this.addAdminItem();
  }
  navigateHome() {
    console.log('To home');

    this.nbMenuService.navigateHome('menu');
  }
  async addAdminItem() {
    const isLibrarian = await this.libroNFTService.isLibrarian();
    if (isLibrarian) {
      this.items.push({
        title: 'Administrador',
        link: '/admin',
        icon: 'settings-outline'
      });
    }

  }
}
