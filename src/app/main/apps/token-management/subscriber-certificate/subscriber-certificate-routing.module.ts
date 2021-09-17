import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { SubscriberCertificateEditComponent } from './subscriber-certificate-edit/subscriber-certificate-edit.component';
import { SubscriberCertificateListComponent } from './subscriber-certificate-list/subscriber-certificate-list.component';
import { SubscriberCertificateViewComponent } from './subscriber-certificate-view/subscriber-certificate-view.component';

const routes: Routes = [
  {
    path: "subscriber-certificate-list",
    component: SubscriberCertificateListComponent,
    // resolve: {
    //   uls: SubscriberCertificateListService,
    // },
    data: { animation: "SubscriberCertificateListComponent" },
  },
  {
    path: "subscriber-certificate-new",
    loadChildren: () => import('./subscriber-certificate-new/subscriber-certificate-new.module').then(m => m.SubscriberCertificateNewModule)
  },
  {
    path: "subscriber-certificate-view/:id",
    component: SubscriberCertificateViewComponent,
    // resolve: {
    //   data: SubscriberCertificateViewService,
    // },
    data: { path: "view/:id", animation: "SubscriberCertificateViewComponent" },
  },
  {
    path: "subscriber-certificate-edit/id",
    component: SubscriberCertificateEditComponent,
    // resolve: { data: SubscriberCertificateEditService },
    data : {
      animation : "SubscriberCertificateEditComponent",
    },
  },
  {
    path : "subscriber-certificate-view",
    redirectTo: "/subscriber-certificate-view/self", //Redirection to self 
  },
  {
    path : "subscriber-certificate-edit",
    redirectTo: "/subscriber-certificate-edit/self", // Redirection to self
  },
  {
    path: "**",
    redirectTo: "/pages/miscellaneous/error", //Error 404 - Page not found
  },
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule, RouterModule.forChild(routes)
  ]
})
export class SubscriberCertificateRoutingModule { }
