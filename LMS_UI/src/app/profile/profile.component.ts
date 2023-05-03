import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
export interface TableElement{
  name:string;
  value:string;
}
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  columns:string[]=['name','value'];
  dataSource:TableElement[]=[];
constructor(private api:ApiService){}
  ngOnInit(): void {
    let user =this.api.getTokenUserInfo();

    this.dataSource=[
      {name:"Name",value:user?.firstName+ " "+user?.lastName},
      {name:"Email",value:user?.email ?? ""},
      {name:"Mobile",value:user?.mobile??""},
      {name:"Blocked",value:this.blockedStatus()},
      {name:"Active",value:this.activeStatus()},
    ]
  }
  blockedStatus():string{
    let bloked=this.api.getTokenUserInfo()!.blocked;
    return bloked?'Yes, you are BLOCKED':'No, you are not Blocked';
  }
  activeStatus():string{
    let active =this.api.getTokenUserInfo()!.active;
    return active ?'Yes, your account is Active' : 'No, your account is not ACTIVE';
  }
}
