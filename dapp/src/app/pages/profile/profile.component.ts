import { Component, OnInit } from '@angular/core';
import { NbMenuItem } from '@nebular/theme';
import { MenuService } from 'src/app/services/menu/menu.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  books;
  menuItems;

  action: string = 'return';

  constructor(menuService: MenuService) {
    this.menuItems = menuService.items;
    this.getBooks();
  }

  ngOnInit(): void {
  }

  getBooks() {
    this.books = [
      {
        title: 'El pozo de la ascension',
        photoURL: 'https://picsum.photos/380/400',
        author: 'Brandom sanderson',
        synopsis: 'Lorem ipsum dolor sit amet',
        tokenId: '1'
      },
    ];

  }
}
