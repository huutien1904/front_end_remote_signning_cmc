import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { SubscriberCertificateEditComponent } from './subscriber-certificate-edit/subscriber-certificate-edit.component';
import { SubscriberCertificateListComponent } from './subscriber-certificate-list/subscriber-certificate-list.component';
import { SubscriberCertificateViewComponent } from './subscriber-certificate-view/subscriber-certificate-view.component';
import { SubscriberCertificateCreateComponent } from './subscriber-certificate-create/subscriber-certificate-create.component';
import { PersonalListService } from '../../identity-provider/subscribers/personals/personal-list/personal-list.service';

const routes: Routes = [
  {
    path: "subscriber-certificate-create",
    component: SubscriberCertificateCreateComponent,
    
  },
  {
    path: "subscriber-certificate-list",
    component: SubscriberCertificateListComponent,
    data: { animation: "SubscriberCertificateListComponent" },
  },

  {
    path: "subscriber-certificate-view/:id",
    component: SubscriberCertificateViewComponent,
    data: { path: "view/:id", animation: "SubscriberCertificateViewComponent" },
  },
  {
    path: "subscriber-certificate-edit/id",
    component: SubscriberCertificateEditComponent,
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
