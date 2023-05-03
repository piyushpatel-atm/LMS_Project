import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Book, Order, User, UserType } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  baseUrl="https://localhost:7102/api/Library/"
  constructor(private http:HttpClient,private jwt:JwtHelperService) { }
  CreateAccount(user:User){
    return this.http.post(this.baseUrl+"CreateAccount",user,{responseType:'text'});
  }
  login(loginInfo:any){
    var param=new HttpParams().append('email',loginInfo.email).append('password',loginInfo.password);
    return this.http.get(this.baseUrl+"Login",{
      params:param,
      responseType:'text'
    });
  }
  savetoken(token:any){
    localStorage.setItem('access_token',token);
  }
  isLoggedIn():boolean{
    return !!localStorage.getItem('access_token');
  }
  deleteToken(){
    localStorage.removeItem('access_token');
    location.reload();
  }
  getTokenUserInfo(): User|null{
    if(!this.isLoggedIn()) return null;
    let token =this.jwt.decodeToken();
    let user: User={
      id:token.id,
      firstName:token.firstName,
      lastName:token.lastName,
      email:token.email,
      mobile:token.email,
      password:'',
      blocked:token.blocked.toLowerCase()==='true',
      active:token.active.toLowerCase()==='true',
      createdOn:token.createdAt,
      fine:0,
      userType:token.userType==='USER'?UserType.USER:UserType.ADMIN,
    };
    return user;
  }
  getAllBooks(){
    return this.http.get<Book[]>(this.baseUrl+'GetAllBooks')
  }
  orderBook(userId:number,bookId:number){
    return this.http.get(this.baseUrl+ 'orderBook/'+ userId+'/'+bookId,{responseType:'text'});
  }
  getOrdersOfUser(userid:number){
    return this.http.get<Order[]>(this.baseUrl+'GetOrders/'+userid);
  }
  getAllOrders(){
    return this.http.get<Order[]>(this.baseUrl+'GetAllOrders')
  }
  returnBook(bookId:string,userId:string){
    return this.http.get(this.baseUrl+'ReturnBook/'+bookId+'/'+userId,{responseType:'text'});
  }
  getAllUsers(){
    return this.http.get<User[]>(this.baseUrl+'GetAllUsers');
  }

  blockUser(id:number){
    return this.http.get(this.baseUrl+'ChangeBlockStatus/1/'+id,{responseType:'text'});
  }
  unblockUser(id:number){
    return this.http.get(this.baseUrl+'ChangeBlockStatus/0/'+id,{responseType:'text'});
  }
  enableUser(id:number){
    return this.http.get(this.baseUrl+'ChangeEnableStatus/1/'+id,{responseType:'text'});
  }
  disableUser(id:number){
    return this.http.get(this.baseUrl+'ChangeEnableStatus/0/'+id,{responseType:'text'});
  }

  insertBook(book:any){
    return this.http.post(this.baseUrl + 'InsertBook',book,{responseType:'text'});
  }
  deleteBook(id:number){
    return this.http.delete(this.baseUrl + 'DeleteBook/'+id,{responseType:'text'});
  }

  insertCategory(category:string,subcategory:string){
    return this.http.post(this.baseUrl+'InsertCategory',{category:category,subCategory:subcategory},{responseType:'text'});
  }
}
