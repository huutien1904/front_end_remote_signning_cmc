import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import { PersonalEditComponent } from "./personal-edit/personal-edit.component";
import { PersonalListComponent } from "./personal-list/personal-list.component";
import { PersonalListService } from "./personal-list/personal-list.service";
import { PersonalViewComponent } from "./personal-view/personal-view.component";
import { PersonalViewService } from "./personal-view/personal-view.service";
import { PersonalListAddComponent } from "./personal-list/personal-list-add/personal-list-add.component";

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
    path: "personal-add-list",
    component: PersonalListAddComponent,
    // resolve: {
    //   uls: PersonalListService,
    // },
    data: { animation: "PersonalListAddComponent" },
  },
  {
    path: "personal-view/:id",
    component: PersonalViewComponent,
    data: { animation: "PersonalViewComponent" },
  },
  {
    path: "personal-edit",
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
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes)],
  providers: [PersonalListService, PersonalViewService],

  exports: [],
})
export class PersonalRoutingModule {}
