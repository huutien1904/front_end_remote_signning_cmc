import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrganizationViewComponent } from './organization-view/organization-view.component';
import { OrganizationEditComponent } from './organization-edit/organization-edit.component';
import { OrganizationListComponent } from './organization-list/organization-list.component';
import { OrganizationViewService } from './organization-view/organization-view.service';
import { OrganizationEditService } from './organization-edit/organization-edit.service';
import { OrganizationListService } from './organization-list/organization-list.service';
import { RouterModule, Routes } from '@angular/router';
import { CoreSidebarModule } from "@core/components";
import { CoreCommonModule } from "@core/common.module";
import { FormsModule } from "@angular/forms";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { NgSelectModule } from "@ng-select/ng-select";
import { Ng2FlatpickrModule } from "ng2-flatpickr";
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { CorePipesModule } from "@core/pipes/pipes.module";
import { CoreDirectivesModule } from "@core/directives/directives";
import { NewOrganizationSidebarComponent } from './organization-list/new-organization-sidebar/new-organization-sidebar.component';
import { ReactiveFormsModule } from "@angular/forms";



@NgModule({
  declarations: [
    NewOrganizationSidebarComponent,
    OrganizationListComponent,
    OrganizationViewComponent,
    OrganizationEditComponent
  ],
  imports: [
    CommonModule,
     
     CoreSidebarModule,
     CoreCommonModule,
    FormsModule,
    NgbModule,
    NgSelectModule,
    Ng2FlatpickrModule,
    NgxDatatableModule,
    CorePipesModule,
    CoreDirectivesModule,
    ReactiveFormsModule
  ],
  exports:[
    NewOrganizationSidebarComponent,
    OrganizationListComponent,
    OrganizationViewComponent,
    OrganizationEditComponent],
  providers: [OrganizationViewService, OrganizationEditService, OrganizationListService],
})
export class OrganizationsModule { }
