import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from './profile/profile.component';
import { RouterModule, Routes } from '@angular/router';


/**
 * Routing
 */

const routes: Routes= [
  {
    path: 'user',
    loadChildren: () => import('./user/user.module').then(m => m.UserModule)
  },
  {
    path:'profile',
    component: ProfileComponent,
  },
  // {
  //   path:'profile',
  //   component: ProfileComponent,
  //   canActivate: [AuthGuard],
  //   data: {roles: [Role.SuperAdmin], animation: "UserListComponent" },
  // }
  {
    path: "**",
    redirectTo: "/pages/miscellaneous/error", //Error 404 - Page not found
  },
]
@NgModule({
  declarations: [
    ProfileComponent
  ],
  imports: [
    CommonModule, RouterModule.forChild(routes),
  ]
})
export class UsersModule { }
