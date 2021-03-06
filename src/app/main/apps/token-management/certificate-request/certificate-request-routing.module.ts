import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { CertificateRequestListComponent } from './certificate-request-list/certificate-request-list.component';
import { CertificateRequestViewComponent } from './certificate-request-view/certificate-request-view.component';

const routes: Routes = [
  {
    path: "certificate-request-list",
    component: CertificateRequestListComponent,
    // resolve: {
    //   uls: CertificateRequestListService,
    // },
    data: { animation: "CertificateRequestListComponent" },
  },
  {
    path: "certificate-request-new",
    loadChildren: () => import('./certificate-request-new/certificate-request-new.module').then(m => m.CertificateRequestNewModule)
  },
  {
    path: "certificate-request-view/:id",
    component: CertificateRequestViewComponent,
    // resolve: {
    //   data: CertificateRequestViewService,
    // },
    data: { path: "view/:id", animation: "CertificateRequestViewComponent" },
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
export class CertificateRequestRoutingModule { }
