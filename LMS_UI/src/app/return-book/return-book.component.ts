import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-return-book',
  templateUrl: './return-book.component.html',
  styleUrls: ['./return-book.component.css']
})
export class ReturnBookComponent implements OnInit{
 ngOnInit(): void {
 }
 status:string='';
 bookForm:FormGroup;
 constructor(private fb :FormBuilder,private api:ApiService){
  this.bookForm=this.fb.group({
    bookId:fb.control('',[Validators.required]),
    userId:fb.control('',[Validators.required])
  });
 }
 returnBook(){
  this.api.returnBook(this.bookForm.value.bookId,this.bookForm.value.userId).subscribe({
    next:(res:any) =>{
      if(res === 'success') this.status='Book Returned';
      else this.status =res;
    },
    error:(err:any) =>console.log(err),
  });
 }

}
