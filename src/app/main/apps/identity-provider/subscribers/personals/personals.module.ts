import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PersonalEditComponent } from "./personal-edit/personal-edit.component";
import { PersonalViewComponent } from "./personal-view/personal-view.component";
import { PersonalListComponent } from "./personal-list/personal-list.component";
import { RouterModule, Routes } from "@angular/router";
import { PersonalListService } from "./personal-list/personal-list.service";
import { PersonalViewService } from "./personal-view/personal-view.service";
import { PersonalEditService } from "./personal-edit/personal-edit.service";

/**
 * Routing
 */
const routes: Routes = [
  {
    path: "personal-list",
    component: PersonalListComponent,
    // resolve: {
    //   uls: PersonalListService,
    // },
    data: { animation: "PersonalListComponent" },
  },

  {
    path: "personal-view/:id",
    component: PersonalViewComponent,
    // resolve: {
    //   data: PersonalViewService,
    // },
    data: { path: "view/:id", animation: "PersonalViewComponent" },
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
    path: "personal-view",
    redirectTo: "/personal-view/self", //Redirection to self
  },
  {
    path: "personal-edit",
    redirectTo: "/personal-edit/self", // Redirection to self
  },
];

@NgModule({
  declarations: [
    PersonalEditComponent,
    PersonalViewComponent,
    PersonalListComponent,
  ],
  imports: [CommonModule, RouterModule.forChild(routes)],
  providers: [PersonalEditService, PersonalListService, , PersonalViewService],
})
export class PersonalsModule {}
