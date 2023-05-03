import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllordersComponent } from './allorders/allorders.component';
import { AuthorizationGuard } from './authorization.guard';
import { AuthenticationGuardGuard } from './Guards/authentication-guard.guard';
import { LibraryComponent } from './library/library.component';
import { LoginComponent } from './login/login.component';
import { ManageBooksComponent } from './manage-books/manage-books.component';
import { ManageCategoriesComponent } from './manage-categories/manage-categories.component';
import { OrderComponent } from './order/order.component';
import { ProfileComponent } from './profile/profile.component';
import { RegisterComponent } from './register/register.component';
import { ReturnBookComponent } from './return-book/return-book.component';
import { UsersListComponent } from './users-list/users-list.component';

const routes: Routes = [
  {
    path: 'books/library',
    component: LibraryComponent,
    canActivate:[AuthenticationGuardGuard]
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path:'user/order',
    component:OrderComponent,
    canActivate:[AuthenticationGuardGuard]
  },
  {
    path:'users/all-orders',
    component:AllordersComponent,
    canActivate:[AuthorizationGuard]
  },
  {
    path:'books/return',
    component:ReturnBookComponent,
    canActivate:[AuthorizationGuard]
  },
  {
    path:'users/list',
    component:UsersListComponent,
    canActivate:[AuthorizationGuard]
  },
  {
    path:'books/maintenance',
    component:ManageBooksComponent,
    canActivate:[AuthorizationGuard]
  },
  {
    path:'books/categories',
    component:ManageCategoriesComponent,
    canActivate:[AuthorizationGuard]
  },
  {
    path:'users/profile',
    component:ProfileComponent,
    canActivate:[AuthenticationGuardGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
