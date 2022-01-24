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
import { ContentHeaderModule } from "app/layout/components/content-header/content-header.module";
import { OrganizationEditComponent } from "./organization-edit/organization-edit.component";
import { OrganizationEditService } from "./organization-edit/organization-edit.service";
import { NewOrganizationSidebarComponent } from "./organization-list/new-organization-sidebar/new-organization-sidebar.component";
import { OrganizationListAddComponent } from './organization-list/organization-list-add/organization-list-add.component';
import { OrganizationListComponent } from "./organization-list/organization-list.component";
import { OrganizationListService } from "./organization-list/organization-list.service";
import { SidebarOrganizationEditComponent } from './organization-list/sidebar-organization-edit/sidebar-organization-edit.component';
import { OrganizationViewComponent } from "./organization-view/organization-view.component";
import { OrganizationViewService } from "./organization-view/organization-view.service";
import { AppRemoveSpace } from './remove-space.directive';

@NgModule({
  declarations: [
    NewOrganizationSidebarComponent,
    OrganizationListComponent,
    OrganizationViewComponent,
    OrganizationEditComponent,
    AppRemoveSpace,
    OrganizationListAddComponent,
    SidebarOrganizationEditComponent,
  ],
  imports: [
    CommonModule,
    CoreSidebarModule,
    CoreCommonModule,
    FormsModule,
    NgbModule,
    NgSelectModule,
    NgxDatatableModule.forRoot({
      messages: {
        emptyMessage: 'Không có dữ liệu', // Message to show when array is presented, but contains no values
        totalMessage: 'tổng', // Footer total message
        selectedMessage: 'selected' // Footer selected message
      }
    }),
    CorePipesModule,
    CoreDirectivesModule,
    ReactiveFormsModule,
    ContentHeaderModule,
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
