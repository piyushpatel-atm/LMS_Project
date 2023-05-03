import { Component, OnInit } from '@angular/core';
import { Order, UserType } from '../models/models';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {
  constructor(public api:ApiService){

  }
  ngOnInit(): void {
    let userid=this.api.getTokenUserInfo()?.id ?? 0;
    this.api.getOrdersOfUser(userid).subscribe({
      next:(res: Order[]) =>{
        console.log(res);
        this.listOfOrders=res;
      },
      error:(err:any)=>{console.log(err)}
    })
  
  }

  listOfOrders:Order[]=[];
  columns:string[]=['id','name','bookid','book','date','returned'];


}
