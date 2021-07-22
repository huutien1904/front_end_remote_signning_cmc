import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserEditComponent } from './user-edit/user-edit.component';
import { UserListComponent } from './user-list/user-list.component';
import { UserViewComponent } from './user-view/user-view.component';



@NgModule({
  declarations: [
    UserEditComponent,
    UserListComponent,
    UserViewComponent
  ],
  imports: [
    CommonModule
  ]
})
export class UserModule { }
