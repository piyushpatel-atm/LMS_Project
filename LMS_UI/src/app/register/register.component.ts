import { Component, OnInit } from '@angular/core';
import { AbstractControl, AbstractControlOptions, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { User, UserType } from '../models/models';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  hide = true;
  responseMsg: string = '';
  registerForm!: FormGroup;
  constructor(private fb: FormBuilder,private api:ApiService) {
    this.registerForm = fb.group(
      {
        firstName: fb.control('', [Validators.required]),
        lastName: fb.control('', [Validators.required]),
        email: fb.control('', [Validators.required, Validators.email]),
        password: fb.control('', [Validators.required, Validators.minLength(8), Validators.maxLength(50)]),
        rpassword: fb.control('',[repeatPasswordValidator]),
        userType: fb.control('student')

      },
      {
        Validators: [repeatPasswordValidator]
      } as AbstractControlOptions
    );
  }
  ngOnInit(): void {

  }
  register(){
   let user : User={
     id: 0,
     firstName: this.registerForm.value.firstName,
     lastName: this.registerForm.value.lastName,
     email: this.registerForm.value.email,
     mobile: '',
     password: this.registerForm.value.password,
     blocked: false,
     active: false,
     createdOn: '',
     userType: UserType.USER,
     fine: 0
   };
   this.api.CreateAccount(user).subscribe({
    next:(res:any)=>{
      console.log(res);
      this.responseMsg=res.toString();
    },
    error:(err:any)=>{
      console.log('Error: ');
      console.log(err);
    }
   });
   this.registerForm.reset();
   
  }
  getFirstNameErrors(){
    if(this.FirstName.hasError('required')) return 'Field is required';
    return '';
  }
  getLastNameErrors(){
    if(this.LastName.hasError('required')) return 'Field is required';
    return '';
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
  get FirstName():FormControl{
    return this.registerForm.get('firstName') as FormControl;
  }
  get LastName():FormControl{
    return this.registerForm.get('lirstName') as FormControl;
  }
  get Email():FormControl{
    return this.registerForm.get('email') as FormControl;
  }
  get Password():FormControl{
    return this.registerForm.get('password') as FormControl;
  }
  get RPassword():FormControl{
    return this.registerForm.get('rpassword') as FormControl;
  }
}




export const repeatPasswordValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const pwd = control.get('password')?.value;
  const rpwd = control.get('rpassword')?.value;
  if (pwd === rpwd) {
    control.get('password')?.setErrors(null);
    return null;
  } else {
    control.get('rpassword')?.setErrors({ rpassword: true });
    return { rpassword: true }
  }
};
