import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HsmCreateComponent } from './hsm-create/hsm-create.component';
import { HsmEditComponent } from './hsm-edit/hsm-edit.component';
import { HsmListComponent } from './hsm-list/hsm-list.component';
import { HsmViewComponent } from './hsm-view/hsm-view.component';

const routes: Routes = [
  {
    path: 'hsm-list',
    component: HsmListComponent,
  },
  {
    path: 'hsm-view/:id',
    component: HsmViewComponent,
  },
  { path: 'hsm-edit/:id', component: HsmEditComponent },
  { path: 'hsm-create', component: HsmCreateComponent },
  {
    path: "**",
    redirectTo: "/pages/miscellaneous/error", //Error 404 - Page not found
  }
];
@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes)],
})
export class HsmManagementRoutes{}
