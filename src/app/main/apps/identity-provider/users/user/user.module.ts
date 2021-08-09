import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { UserEditComponent } from "./user-edit/user-edit.component";
import { UserListComponent } from "./user-list/user-list.component";
import { UserViewComponent } from "./user-view/user-view.component";
import { RouterModule, Routes } from "@angular/router";
import { UserListService } from "./user-list/user-list.service";
import { UserViewService } from "./user-view/user-view.service";
import { UserEditService } from "./user-edit/user-edit.service";
import { CoreCommonModule } from "@core/common.module";
import { FormsModule } from "@angular/forms";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { NgSelectModule } from "@ng-select/ng-select";
import { Ng2FlatpickrModule } from "ng2-flatpickr";
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { CorePipesModule } from "@core/pipes/pipes.module";
import { CoreDirectivesModule } from "@core/directives/directives";
import { CoreSidebarModule } from "@core/components";
import { NewUserSidebarComponent } from "./user-list/new-user-sidebar/new-user-sidebar.component";

import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { HttpClientModule } from '@angular/common/http';
import { InMemoryDataService } from './data/in-memory-data.service';

import { Role } from "app/auth/models";
import { AuthGuard } from "app/auth/helpers/auth.guards";
// import { BFormSelect } from 'bootstrap-vue'


/**
/**
 * Routing
 */

const routes: Routes = [
  {
    path: "user-list",
    component: UserListComponent,
    canActivate: [AuthGuard],
    resolve: {
      uls: UserListService
    },
    data: { animation: "UserListComponent" },
  },
  {
    path: "user-view/:id",
    component: UserViewComponent,
    resolve: {
       data: UserViewService
    },
    data: { path: "view/:id", animation: "UserViewComponent" },
  },
  {
    path: "user-edit/:id",
    component: UserEditComponent,
    resolve: {
      ues: UserEditService
    },
    data: { animation: "UserEditComponent" },
  },
  {
    path: "user-view",
    redirectTo: "/apps/user/user-view/2", // Redirection
  },
  {
    path: "user-edit",
    redirectTo: "/apps/user/user-edit/2", // Redirection
  },
  {
    path: "**",
    redirectTo: "/pages/miscellaneous/error", //Error 404 - Page not found
  },
];
@NgModule({
  declarations: [UserEditComponent, UserListComponent, UserViewComponent,NewUserSidebarComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    CoreCommonModule,
    FormsModule,
    NgbModule,
    NgSelectModule,
    Ng2FlatpickrModule,
    NgxDatatableModule,
    CorePipesModule,
    CoreDirectivesModule,
    CoreSidebarModule,
    HttpClientModule,
    HttpClientInMemoryWebApiModule.forRoot(
    InMemoryDataService, { dataEncapsulation: false }
    )
    // BFormSelect
  ],
  providers: [UserListService, UserEditService, UserViewService],
})
export class UserModule {}
