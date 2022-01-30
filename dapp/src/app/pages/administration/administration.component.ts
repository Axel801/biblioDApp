import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NbMenuItem } from '@nebular/theme';
import { MenuService } from 'src/app/services/menu/menu.service';

@Component({
  selector: 'app-administration',
  templateUrl: './administration.component.html',
  styleUrls: ['./administration.component.css']
})
export class AdministrationComponent implements OnInit {

  menuItems;
  addBookForm;
  constructor(private menuService: MenuService,
    private formBuilder: FormBuilder) {
    this.menuItems = menuService.items;
    this.addBookForm = this.formBuilder.group({
      title: '',
      author: '',
      photo: '',
      synopsis: '',
      isbn: ''
    });
  }

  ngOnInit(): void {
  }


  submitAddBook(dataFields) {
    console.log(dataFields);

  }
}
