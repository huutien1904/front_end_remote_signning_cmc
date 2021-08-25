import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';


/**
 * Routing
 */
// const routes: Routes = [
//   { 
//     path: 'personals',
//     loadChildren:()=> import('./personals/personals.module').then(m => m.PersonalsModule)
//   },
//   { 
//     path : 'organizations',
//     loadChildren:()=> import('./organizations/organizations.module').then(m => m.OrganizationsModule)
//   },
//   {
//     path: "**",
//     redirectTo: "/pages/miscellaneous/error", //Error 404 - Page not found
//   },
// ]
@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule, 
    // RouterModule.forChild(routes),
  ]
})
export class SubscribersModule { }
