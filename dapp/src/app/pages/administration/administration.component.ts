import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NbMenuItem } from '@nebular/theme';
import { LibroNFTService } from 'src/app/services/libroNFT/libro-nft.service';
import { IpfsService } from 'src/app/services/ipfs/ipfs.service';
import { MenuService } from 'src/app/services/menu/menu.service';

@Component({
  selector: 'app-administration',
  templateUrl: './administration.component.html',
  styleUrls: ['./administration.component.css']
})
export class AdministrationComponent implements OnInit {

  menuItems;
  addBookForm;
  bufferFile;
  pattern;

  constructor(
    private menuService: MenuService,
    private formBuilder: FormBuilder,
    private libroNFTService: LibroNFTService,
    private ipfsService: IpfsService
  ) {
    this.menuItems = this.menuService.items;
    this.pattern = "^[a-zA-Z0-9ÑñÜü\:\,\.\ ÁáÉéÍíÓóÚú]+$";
    this.addBookForm = this.formBuilder.group({
      title: ['', [Validators.pattern(this.pattern), Validators.required]],
      author: ['', [Validators.pattern(this.pattern), Validators.required]],
      //photo: ['',Validators.required],
      synopsis: ['', [Validators.pattern(this.pattern), Validators.required]],
      isbn: ['', [Validators.pattern(this.pattern), Validators.required]]
    });
  }

  ngOnInit(): void {
  }

  async submitAddBook(dataFields) {


    if (this.addBookForm.invalid) {
      alert("Caracteres raros");
      return;
    }
    const photo = await this.ipfsService.add(this.bufferFile);
    this.libroNFTService.mintNewBook(dataFields.title, dataFields.author, photo, dataFields.synopsis, dataFields.isbn)
    console.log('SUCCESS');

  }

  getBufferFile(event) {
    const files = event.target.files;
    let reader = new FileReader();
    reader.readAsArrayBuffer(files[0]);
    reader.onloadend = async () => {
      this.bufferFile = await this.ipfsService.convertToBuffer(reader); console.log(this.bufferFile);
    };
  }

}
