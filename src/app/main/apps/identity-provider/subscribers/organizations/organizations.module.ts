import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrganizationViewComponent } from './organization-view/organization-view.component';
import { OrganizationEditComponent } from './organization-edit/organization-edit.component';
import { OrganizationListComponent } from './organization-list/organization-list.component';



@NgModule({
  declarations: [
    OrganizationViewComponent,
    OrganizationEditComponent,
    OrganizationListComponent
  ],
  imports: [
    CommonModule
  ]
})
export class OrganizationsModule { }
