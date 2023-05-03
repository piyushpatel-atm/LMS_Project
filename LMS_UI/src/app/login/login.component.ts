import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
hide=true;
responseMsg="";

loginForm!: FormGroup;
constructor(private fb: FormBuilder, private api:ApiService,private jwt:JwtHelperService,private router:Router) {
  this.loginForm = fb.group(
    {
      email: fb.control('', [Validators.required, Validators.email]),
      password: fb.control('', [Validators.required, Validators.minLength(8), Validators.maxLength(50)]),
    }
  );
}
ngOnInit(): void {

}
login(){
  let loginInfo={
    email:this.loginForm.value.email,
    password:this.loginForm.value.password
  }
  this.api.login(loginInfo).subscribe({
    next:(res:any)=>{
      if(res.toString()==='Invalid'){
        this.responseMsg="Invalid Credentials";
      }else{
        this.responseMsg="";
        this.api.savetoken(res.toString());
        let isActive=this.api.getTokenUserInfo()?.active ?? false;
        console.log(isActive);
        if(isActive) this.router.navigateByUrl('/books/library');
        else {
          this.responseMsg='You are not Active';
          this.api.deleteToken();
      };
      }
    },
    error:(err:any)=>{
        console.log(err);
    }
  })
}

getEmailErrors(){
  if(this.Email.hasError('required')) return 'Email is required';
  if(this.Email.hasError('email')) return 'Email is invalid';
  return '';
}
getPasswordErrors(){
  if(this.Password.hasError('required')) return 'Password is required';
  if(this.Password.hasError('minLength'))
   return 'minimum 8 characters are required';
  if(this.Password.hasError('maxLength')) 
   return 'Maximum 15 characters are required';
  return '';
}

get Email():FormControl{
  return this.loginForm.get('email') as FormControl;
}
get Password():FormControl{
  return this.loginForm.get('password') as FormControl;
}

}
