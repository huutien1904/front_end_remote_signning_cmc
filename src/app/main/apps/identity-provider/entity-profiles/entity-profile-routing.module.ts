import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ProfileListComponent } from './entity-profile-list/entity-profile-list.component';
import { ProfileEditComponent } from './entity-profile-edit/entity-profile-edit.component';


const routes: Routes = [
  {
    path: "profile-list",
    component: ProfileListComponent,
    data: { animation: "ProfileListComponent" },
  },
  {
    path: "profile-edit/:id",
    component: ProfileEditComponent,
    data: {
      animation: "ProfileEditComponent",
    },
  },
  {
    path: "**",
    redirectTo: "/pages/miscellaneous/error", //Error 404 - Page not found
  },
];
@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes)],
})
export class ProfileRoutingModule { }
