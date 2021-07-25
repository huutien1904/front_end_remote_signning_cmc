import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';


/**
 * Routing
 */

const routes:Routes = [
  {
    path: 'users',
    loadChildren: () => import('./users/users.module').then(m => m.UsersModule)
  },
  {
    path: 'subscribers',
    loadChildren: () => import('./subscribers/subscribers.module').then(m => m.SubscribersModule)
  }
]

@NgModule({
  declarations: [],
  imports: [
    CommonModule, RouterModule.forChild(routes),
  ]
})
export class IdentityProviderModule { }
