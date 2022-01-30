import { Component, Input, OnInit } from '@angular/core';


@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit {

  @Input() book?;
  @Input() action;

  textButton: string = '';
  constructor() {


  }

  ngOnInit(): void {
    console.log(this.action);
    this.textButton = this.action == 'rent' ? 'Alquilar' : 'Devolver';
  }

  doAction() {
    switch (this.action) {
      case 'rent':
        alert('Alquilar');
        break;
      case 'return':
        alert('Devolver');
        break;
    }
  }
}
