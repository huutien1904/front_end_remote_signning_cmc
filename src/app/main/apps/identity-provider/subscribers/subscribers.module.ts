import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes } from '@angular/router';


/**
 * Routing
 */
const routes: Routes = [
  { 
    path: 'personal',
    loadChildren:()=> import('./personals/personals.module').then(m => m.PersonalsModule)
  },
  { 
    path : 'organizations',
    loadChildren:()=> import('./organizations/organizations.module').then(m => m.OrganizationsModule)
  }
]
@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule
  ]
})
export class SubscribersModule { }
