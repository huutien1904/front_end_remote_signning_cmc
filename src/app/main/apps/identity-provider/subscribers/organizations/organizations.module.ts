import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrganizationViewComponent } from './organization-view/organization-view.component';
import { OrganizationEditComponent } from './organization-edit/organization-edit.component';
import { OrganizationListComponent } from './organization-list/organization-list.component';
import { OrganizationViewService } from './organization-view/organization-view.service';
import { OrganizationEditService } from './organization-edit/organization-edit.service';
import { OrganizationListService } from './organization-list/organization-list.service';
import { RouterModule, Routes } from '@angular/router';


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
  }
];
@NgModule({
  declarations: [
    OrganizationViewComponent,
    OrganizationEditComponent,
    OrganizationListComponent
  ],
  imports: [
    CommonModule, RouterModule.forChild(routes),
  ]
})
export class OrganizationsModule { }
