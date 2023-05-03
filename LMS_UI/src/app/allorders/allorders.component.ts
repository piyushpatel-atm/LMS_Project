import { Component, OnInit } from '@angular/core';
import { Order } from '../models/models';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-allorders',
  templateUrl: './allorders.component.html',
  styleUrls: ['./allorders.component.css']
})
export class AllordersComponent implements OnInit{
  constructor(private api:ApiService){

  }
  ngOnInit(): void {
    this.api.getAllOrders().subscribe({
      next:(res:Order[])=>{
        this.listOfOrders=res;
        console.log(res);
        this.orderToDisplay=this.listOfOrders;
        console.log(this.orderToDisplay)
      },
      error:(err:any)=>{console.log(err)},
    })
  };
  listOfOrders:Order[]=[];
  orderToDisplay:Order[]=[];
  columns:string[]=[
    'id',
    'userid',
    'name',
    'bookid',
    'bookName',
    'date',
    'returned',
  ];
  filter(value:string){
    if(value ==='all'){
      this.orderToDisplay=this.listOfOrders.filter((value)=>value);
    }else if(value === 'pen'){
      this.orderToDisplay=this.listOfOrders.filter((value)=>value.returned == false);
    }else{
      this.orderToDisplay=this.listOfOrders.filter(
        (value)=>value.returned
      );
    }
  }



}
