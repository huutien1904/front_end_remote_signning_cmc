import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CertificateRequestListComponent } from "./certificate-request-list/certificate-request-list.component";
import { CertificateRequestViewComponent } from "./certificate-request-view/certificate-request-view.component";
import { CertificateRequestEditComponent } from "./certificate-request-edit/certificate-request-edit.component";
import { RouterModule, Routes } from "@angular/router";

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
    path: "certificate-request-view/:id",
    component: CertificateRequestViewComponent,
    // resolve: {
    //   data: CertificateRequestViewService,
    // },
    data: { path: "view/:id", animation: "CertificateRequestViewComponent" },
  },
  {
    path: "certificate-request-edit/id",
    component: CertificateRequestEditComponent,
    // resolve: { data: CertificateRequestEditService },
    data : {
      animation : "CertificateRequestEditComponent",
    },
  },
  {
    path : "certificate-request-view",
    redirectTo: "/certificate-request-view/self", //Redirection to self 
  },
  {
    path : "certificate-request-edit",
    redirectTo: "/certificate-request-edit/self", // Redirection to self
  }
];

@NgModule({
  declarations: [
    CertificateRequestListComponent,
    CertificateRequestViewComponent,
    CertificateRequestEditComponent,
  ],
  imports: [CommonModule, RouterModule.forChild(routes)],
})
export class CertificateRequestModule {}
