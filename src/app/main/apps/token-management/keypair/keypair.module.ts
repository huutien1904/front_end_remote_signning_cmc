import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { KeypairListComponent } from './keypair-list/keypair-list.component';
import { KeypairViewComponent } from './keypair-view/keypair-view.component';
import { KeypairEditComponent } from './keypair-edit/keypair-edit.component';


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
    path : "keypair-edit",
    redirectTo: "/keypair-edit/self", // Redirection to self
  }
];


@NgModule({
  declarations: [],
  imports: [
    CommonModule,RouterModule.forChild(routes)
  ]
})
export class KeypairModule { }
