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
  }
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
