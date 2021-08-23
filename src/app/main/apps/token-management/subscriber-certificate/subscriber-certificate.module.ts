import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { SubscriberCertificateListComponent } from './subscriber-certificate-list/subscriber-certificate-list.component';
import { SubscriberCertificateViewComponent } from './subscriber-certificate-view/subscriber-certificate-view.component';
import { SubscriberCertificateEditComponent } from './subscriber-certificate-edit/subscriber-certificate-edit.component';


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
  declarations: [SubscriberCertificateListComponent],
  imports: [
    CommonModule,
    NgSelectModule,
    NgbCollapseModule,
    FormsModule,
    RouterModule.forChild(routes)
  ]
})
export class SubscriberCertificateModule { }
