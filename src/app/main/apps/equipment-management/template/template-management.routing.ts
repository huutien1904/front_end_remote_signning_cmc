import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TemplateCreateComponent } from './template-create/template-create.component';
import { TemplateEditComponent } from './template-edit/template-edit.component';
import { TemplateListComponent } from './template-list/template-list.component';
import { TemplateViewComponent } from './template-view/template-view.component';


const routes: Routes = [
  {
    path: 'template-list',
    component: TemplateListComponent,
  },
  {
    path: 'template-view/:id',
    component: TemplateViewComponent,
  },
  { path: 'template-edit/:id', component: TemplateEditComponent },
  { path: 'template-create', component: TemplateCreateComponent },
  {
    path: "**",
    redirectTo: "/pages/miscellaneous/error", //Error 404 - Page not found
  }
];
@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes)],
})
export class TemplateManagementRoutes{}
