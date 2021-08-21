import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PersonalEditComponent } from "./personal-edit/personal-edit.component";
import { PersonalViewComponent } from "./personal-view/personal-view.component";
import { PersonalListComponent } from "./personal-list/personal-list.component";
import { RouterModule, Routes } from "@angular/router";
import { PersonalListService } from "./personal-list/personal-list.service";
import { PersonalViewService } from "./personal-view/personal-view.service";
import { PersonalEditService } from "./personal-edit/personal-edit.service";
import { CoreCommonModule } from "@core/common.module";
import { FormsModule } from "@angular/forms";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { NgSelectModule } from "@ng-select/ng-select";
import { Ng2FlatpickrModule } from "ng2-flatpickr";
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { CorePipesModule } from "@core/pipes/pipes.module";
import { CoreDirectivesModule } from "@core/directives/directives";
import { CoreSidebarModule } from "@core/components";
import { NewPersonalSidebarComponent } from './personal-list/new-personal-sidebar/new-personal-sidebar.component';
import { ReactiveFormsModule } from "@angular/forms";

/**
 * Routing
 */
const routes: Routes = [
  {
    path: "personal-list",
    component: PersonalListComponent,
    resolve: {
      uls: PersonalListService,
    },
    data: { animation: "PersonalListComponent" },
  },

  {
    path: "personal-view/:id",
    component: PersonalViewComponent,
    resolve: {
      data: PersonalViewService,
    },
    data: { animation: "PersonalViewComponent" },
  },
  {
    path: "personal-edit/id",
    component: PersonalEditComponent,
    // resolve: { data: PersonalEditService },
    data: {
      animation: "PersonalEditComponent",
    },
  },
  {
    path: "personal-view/id",
    component: PersonalViewComponent,
    resolve: { data: PersonalViewService },
    data: {
      animation: "PersonalViewComponent",
    },
    redirectTo: "/personal-view", //Redirection to self
  },
  {
    path: "personal-edit",
    redirectTo: "/personal-edit/self", // Redirection to self
  },
  {
    path: "**",
    redirectTo: "/pages/miscellaneous/error", //Error 404 - Page not found
  },
];

@NgModule({
  declarations: [
   
  ],
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
    ReactiveFormsModule,
    // BsModalService
    // JwPaginationModule
  ],
  // exports:[PersonalListComponent],
  providers: [PersonalEditService, PersonalListService, , PersonalViewService],
})
export class PersonalsModule {}
