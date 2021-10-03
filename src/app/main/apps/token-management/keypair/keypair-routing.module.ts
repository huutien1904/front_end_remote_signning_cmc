import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KeypairListComponent } from './keypair-list/keypair-list.component';
import { KeypairViewComponent } from './keypair-view/keypair-view.component';
import { KeypairEditComponent } from './keypair-edit/keypair-edit.component';
import { RouterModule, Routes } from '@angular/router';
import { KeypairCreateComponent } from './keypair-create/keypair-create.component';
const routes: Routes = [
  {
    path: "keypair-list",
    component: KeypairListComponent,
    // resolve: {
    //   uls: KeypairListService,
    // },
    data: { animation: "KeypairListComponent" },
  },
  {
    path: "keypair-create",
    component: KeypairCreateComponent,
    // resolve: {
    //   uls: KeypairListService,
    // },
    data: { animation: "KeypairCreateComponent" },
  },

  {
    path: "keypair-view/:id",
    component: KeypairViewComponent,
    // resolve: {
    //   data: KeypairViewService,
    // },
    data: { path: "view/:id", animation: "KeypairViewComponent" },
  },
  {
    path: "keypair-edit/id",
    component: KeypairEditComponent,
    // resolve: { data: KeypairEditService },
    data : {
      animation : "KeypairEditComponent",
    },
  },
  {
    path : "keypair-view",
    redirectTo: "/keypair-view/self", //Redirection to self 
  },
  {
    path : "keypair-template",
    loadChildren: () => import('./keypair-template/keypair-template.module').then(m => m.KeypairTemplateModule)
  },
  {
    path : "keypair-edit",
    redirectTo: "/keypair-edit/self", // Redirection to self
  },
  {
    path: "**",
    redirectTo: "/pages/miscellaneous/error", //Error 404 - Page not found
  },
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,RouterModule.forChild(routes)
  ]
})
export class KeypairRoutingModule { }
