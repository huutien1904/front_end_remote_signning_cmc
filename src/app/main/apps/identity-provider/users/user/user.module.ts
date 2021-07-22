import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserEditComponent } from './user-edit/user-edit.component';
import { UserListComponent } from './user-list/user-list.component';
import { UserViewComponent } from './user-view/user-view.component';
import { RouterModule, Routes } from '@angular/router';
import { UserListService } from './user-list/user-list.service';
import { UserViewService } from './user-view/user-view.service';
import { UserEditService } from './user-edit/user-edit.service';
import { NgSelectModule } from '@ng-select/ng-select';

/**
 * Routing
 */

const routes: Routes = [
  {
    path: 'user-list',
    component: UserListComponent,
    // resolve: {
    //   uls: UserListService
    // },
    data: { animation: 'UserListComponent' }
  },
  {
    path: 'user-view/:id',
    component: UserViewComponent,
    // resolve: {
    //   data: UserViewService
    // },
    data: { path: 'view/:id', animation: 'UserViewComponent' }
  },
  {
    path: 'user-edit/:id',
    component: UserEditComponent,
    // resolve: {
    //   ues: UserEditService
    // },
    data: { animation: 'UserEditComponent' }
  },
  {
    path: 'user-view',
    redirectTo: '/apps/user/user-view/2' // Redirection
  },
  {
    path: 'user-edit',
    redirectTo: '/apps/user/user-edit/2' // Redirection
  }
];
@NgModule({
  declarations: [
    UserEditComponent,
    UserListComponent,
    UserViewComponent
  ],
  imports: [
    CommonModule, RouterModule.forChild(routes),NgSelectModule,
  ],
  providers: [
    UserListService, UserEditService, UserViewService
  ]
})
export class UserModule { }
