import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';


const routes: Routes = [
    { 
      path: 'personals',
      loadChildren:()=> import('./personals/personal-routing.module').then(m => m.PersonalRoutingModule)
    },
    { 
      path : 'organizations',
      loadChildren:()=> import('./organizations/organizations.module').then(m => m.OrganizationsModule)
    },
    {
      path: "**",
      redirectTo: "/pages/miscellaneous/error", //Error 404 - Page not found
    },
]
@NgModule({
    declarations: [],
    imports: [
      CommonModule,RouterModule.forChild(routes)
    ]
})

export class SubscriseRoutingModule{

}