import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { PersonalEditComponent } from "./personal-edit/personal-edit.component";
import { PersonalListAddComponent } from "./personal-list/personal-list-add/personal-list-add.component";
import { PersonalListComponent } from "./personal-list/personal-list.component";
import { PersonalViewComponent } from "./personal-view/personal-view.component";

const routes: Routes = [
  {
    path: "personal-list",
    component: PersonalListComponent,
  },
  {
    path: "personal-add-list",
    component: PersonalListAddComponent,
    data: { animation: "PersonalListAddComponent" },
  },
  {
    path: "personal-view/:id",
    component: PersonalViewComponent,
  },
  {
    path: "personal-edit/:id",
    component: PersonalEditComponent,
    // resolve: { data: PersonalEditService },
    data: {
      animation: "PersonalEditComponent",
    },
  },
  {
    path: "personal-view/id",
    component: PersonalViewComponent,
    data: {
      animation: "PersonalViewComponent",
    },
    // redirectTo: "/personal-view", //Redirection to self
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
  providers: [],

  exports: [],
})
export class PersonalRoutingModule {}
