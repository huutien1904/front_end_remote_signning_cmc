// import { ModuleNewPersonalSidebar } from './subscribers/personals/personal-list/new-personal-sidebar/new-personal-sidebar.module';
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule, Routes } from "@angular/router";
import { CoreCommonModule } from "@core/common.module";
import { CoreSidebarModule } from "@core/components";
import { CoreDirectivesModule } from "@core/directives/directives";
import { CorePipesModule } from "@core/pipes/pipes.module";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { NgSelectModule } from "@ng-select/ng-select";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { Ng2FlatpickrModule } from "ng2-flatpickr";
import { OrganizationsModule } from "./subscribers/organizations/organizations.module";
import { PersonalsModule } from "./subscribers/personals/personals.module";
import { UserModule } from "./users/user/user.module";
/**
 * Routing
 */

const routes: Routes = [
  {
    path: "subscribers-search",
    loadChildren: () =>
      import("./search-subscriber/search-subscriber.module").then(
        (m) => m.SearchSubcribersModule
      ),
  },
  {
    path: "subscribers",
    loadChildren: () =>
      import("./subscribers/subscribers-routing.module").then(
        (m) => m.SubscriseRoutingModule
      ),
  },
  {
    path: "**",
    redirectTo: "/pages/miscellaneous/error", //Error 404 - Page not found
  },
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    NgbModule,
    CoreCommonModule,
    UserModule,
    OrganizationsModule,
    FormsModule,
    NgbModule,
    NgSelectModule,
    Ng2FlatpickrModule,
    NgxDatatableModule,
    CorePipesModule,
    CoreDirectivesModule,
    CoreSidebarModule,
    ReactiveFormsModule,
    PersonalsModule,
  ],

  providers: [],
})
export class IdentityProviderModule {
  constructor() {}

  ngOnInit(): void {}
}
