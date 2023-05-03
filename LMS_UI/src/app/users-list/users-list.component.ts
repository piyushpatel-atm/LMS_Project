import { Component, OnInit } from '@angular/core';

import { User, UserType } from '../models/models';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css']
})
export class UsersListComponent implements OnInit {
  constructor(private api: ApiService) { }
  ngOnInit(): void {
    this.api.getAllUsers().subscribe({
      next: (res: User[]) => {
        this.users = [];
        res.forEach(element => {
          var temp: User = element
          temp.userType = element.userType == 0 ? UserType.USER : UserType.ADMIN;
          this.users.push(element);
        });
        console.log(this.users)
      },
      error: (err: any) => {
        console.log(err);
      }

    })
  }
  users: User[] = [];
  columnsToDisplay: string[] = [
    'id',
    'name',
    'email',
    'mobile',
    'fine',
    'blocked',
    'active',
    'created on',
    'action',
  ];

  blockUser(user: User) {
    if (user.blocked) {
      this.api.unblockUser(user.id).subscribe({
        next: (res: any) => {
          if (res === 'success') user.blocked = false;
        },
        error: (err: any) => console.log(err),
      });
    } else {
      this.api.blockUser(user.id).subscribe({
        next: (res: any) => {
          if (res === 'success') user.blocked = true;
        },
        error: (err: any) => console.log(err),
      });
    }
  }
  enableUser(user: User) {
    if (user.active) {
      this.api.disableUser(user.id).subscribe({
        next: (res: any) => {
          if (res === 'success') user.active = false;
        },
        error: (err: any) => console.log(err),
      });
    } else {
      this.api.enableUser(user.id).subscribe({
        next: (res: any) => {
          if (res === 'success') user.active = true;
        },
        error: (err: any) => console.log(err),
      });
    }
  }
}
