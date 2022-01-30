import { Injectable } from '@angular/core';
import { NbMenuItem, NbMenuService } from '@nebular/theme';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  items: NbMenuItem[];
  constructor(private nbMenuService: NbMenuService) {
    this.items = [
      {
        title: 'Alquilar',
        icon: 'book',
        link: '',
        url: '/',
      },
      {
        title: 'Mios',
        link: '/profile',
        icon: 'award-outline'
      },
      {
        title: 'Administrador',
        link: '/admin',
        icon: 'settings-outline'
      }
    ];
  }
  navigateHome() {
    console.log('To home');

    this.nbMenuService.navigateHome('menu');
  }
}
