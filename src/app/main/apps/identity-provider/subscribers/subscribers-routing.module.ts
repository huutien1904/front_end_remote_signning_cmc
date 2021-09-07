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
      loadChildren:()=> import('./organizations/organizations-routing.module').then(m => m.OrganizationsRoutingModule)
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
    ],
    exports: [RouterModule],
})

export class SubscriseRoutingModule{

}