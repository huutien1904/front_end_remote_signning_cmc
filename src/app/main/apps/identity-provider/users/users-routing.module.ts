import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ProfileComponent } from './profile/profile.component';
import { CreateSelfComponent } from './create-self/create-self.component';
import { SubscriberCertificateListComponent } from './subscriber-certificate-list/subscriber-certificate-list.component';
import { CertificateRequestListComponent } from './certificate-request-list/certificate-request-list.component';


const routes: Routes = [
  {
    path: "profile",
    component: ProfileComponent,
    data: {
      animation: "ProfileComponent",
    },
  },
  {
    path: "set-user",
    component: CreateSelfComponent,
    data: {
      animation: "CreateSelfComponent",
    },
  },
  {
    path: "subscriber-certificate-list",
    component: SubscriberCertificateListComponent,
    data: {
      animation: "SubscriberCertificateListComponent",
    },
  },
  {
    path: "certificate-request-list",
    component: CertificateRequestListComponent,
    data: {
      animation: "CertificateRequestListComponent",
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
  exports: [],
})
export class UsersRoutingModule { }
