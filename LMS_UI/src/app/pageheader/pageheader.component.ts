import { Component, EventEmitter, Output } from '@angular/core';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-pageheader',
  templateUrl: './pageheader.component.html',
  styleUrls: ['./pageheader.component.css']
})
export class PageheaderComponent {

  @Output() menuClicked=new EventEmitter<boolean>()
  constructor(public api:ApiService){}
}
