import { Component, OnInit } from '@angular/core';
import { NbMenuItem } from '@nebular/theme';
import { MenuService } from 'src/app/services/menu/menu.service';

@Component({
  selector: 'app-library',
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.css']
})
export class LibraryComponent implements OnInit {
  isLibrary;

  books;
  menuItems;

  action: string = 'rent';

  constructor(menuService: MenuService) {
    this.menuItems = menuService.items;

    // console.log(this.action);

    this.getBooks();

  }

  ngOnInit(): void {
  }


  getBooks() {

    this.books = [
      {
        title: 'El nombre del viento',
        photoURL: 'https://picsum.photos/380/400',
        author: 'Patrick',
        synopsis: 'Lorem ipsum dolor sit amet',
        tokenId: '1'
      },
    ];

  }

}
