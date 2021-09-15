import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CoreCommonModule } from "@core/common.module";
import { CoreSidebarModule } from "@core/components";
import { CoreDirectivesModule } from "@core/directives/directives";
import { CorePipesModule } from "@core/pipes/pipes.module";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { NgSelectModule } from "@ng-select/ng-select";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { OrganizationEditComponent } from "./organization-edit/organization-edit.component";
import { OrganizationEditService } from "./organization-edit/organization-edit.service";
import { NewOrganizationSidebarComponent } from "./organization-list/new-organization-sidebar/new-organization-sidebar.component";
import { OrganizationListComponent } from "./organization-list/organization-list.component";
import { OrganizationListService } from "./organization-list/organization-list.service";
import { OrganizationViewComponent } from "./organization-view/organization-view.component";
import { OrganizationViewService } from "./organization-view/organization-view.service";

@NgModule({
  declarations: [
    NewOrganizationSidebarComponent,
    OrganizationListComponent,
    OrganizationViewComponent,
    OrganizationEditComponent,
  ],
  imports: [
    CommonModule,
    CoreSidebarModule,
    CoreCommonModule,
    FormsModule,
    NgbModule,
    NgSelectModule,
    NgxDatatableModule,
    CorePipesModule,
    CoreDirectivesModule,
    ReactiveFormsModule,
  ],
  exports: [
    NewOrganizationSidebarComponent,
    OrganizationListComponent,
    OrganizationViewComponent,
    OrganizationEditComponent,
  ],
  providers: [
    OrganizationViewService,
    OrganizationEditService,
    OrganizationListService,
  ],
})
export class OrganizationsModule {}
