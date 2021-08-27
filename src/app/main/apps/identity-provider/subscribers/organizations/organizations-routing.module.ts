import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { OrganizationEditComponent } from './organization-edit/organization-edit.component';
import { OrganizationListComponent } from './organization-list/organization-list.component';
import { OrganizationViewComponent } from './organization-view/organization-view.component';

const routes: Routes = [
    {
      path: "organization-list",
      component: OrganizationListComponent,
      // resolve: {
      //   uls: OrganizationListService,
      // },
      data: { animation: "OrganizationListComponent" },
    },
  
    {
      path: "organization-view/:id",
      component: OrganizationViewComponent,
      // resolve: {
      //   data: OrganizationViewService,
      // },
      data: { path: "view/:id", animation: "OrganizationViewComponent" },
    },
    {
      path: "organization-edit/id",
      component: OrganizationEditComponent,
      // resolve: { data: OrganizationEditService },
      data : {
        animation : "OrganizationEditComponent",
      },
    },
    {
      path : "organization-view",
      redirectTo: "/organization-view/self", //Redirection to self 
    },
    {
      path : "organization-edit",
      redirectTo: "/organization-edit/self", // Redirection to self
    },
    {
      path: "**",
      redirectTo: "/pages/miscellaneous/error", //Error 404 - Page not found
    },
  ];
  @NgModule({
    declarations: [],
    imports: [
      CommonModule,RouterModule.forChild(routes)
    ]
})

export class OrganizationsRoutingModule{

}