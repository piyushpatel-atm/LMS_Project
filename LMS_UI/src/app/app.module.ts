import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PageheaderComponent } from './pageheader/pageheader.component';
import { PagefooterComponent } from './pagefooter/pagefooter.component';
import { SideNavComponent } from './side-nav/side-nav.component';
import { MaterialModule } from './material';
import { LibraryComponent } from './library/library.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';  
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { HttpClientModule } from '@angular/common/http';
import { JwtModule } from '@auth0/angular-jwt';
import { OrderComponent } from './order/order.component';
import { AllordersComponent } from './allorders/allorders.component';
import { ReturnBookComponent } from './return-book/return-book.component';
import { UsersListComponent } from './users-list/users-list.component';
import { ManageBooksComponent } from './manage-books/manage-books.component';
import { ManageCategoriesComponent } from './manage-categories/manage-categories.component';
import { ProfileComponent } from './profile/profile.component';
@NgModule({
  declarations: [
    AppComponent,
    PageheaderComponent,
    PagefooterComponent,
    SideNavComponent,
    LibraryComponent,
    LoginComponent,
    RegisterComponent,
    OrderComponent,
    AllordersComponent,
    ReturnBookComponent,
    UsersListComponent,
    ManageBooksComponent,
    ManageCategoriesComponent,
    ProfileComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,MaterialModule,ReactiveFormsModule,CommonModule,MatFormFieldModule,HttpClientModule,
    JwtModule.forRoot({
      config:{
        tokenGetter: () =>{
          return localStorage.getItem('access_token');
        },
        allowedDomains:['localhost:7102']
      }
    })
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
