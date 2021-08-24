import { KeypairModule } from "./keypair/keypair.module";
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CertificateRequestModule } from "./certificate-request/certificate-request.module";
import { SubscriberCertificateRoutingModule } from "./subscriber-certificate/subscriber-certificate-routing.module";
import { SubscriberCertificateModule } from "./subscriber-certificate/subscriber-certificate.module";
/**
 * Routing
 */

const routes: Routes = [
  {
    path: "search",
    loadChildren: () =>
      import("./search/search.module").then((m) => m.SearchModule),
  },
  {
    path: "subscriber-certificate",
    loadChildren: () =>
      import(
        "./subscriber-certificate/subscriber-certificate-routing.module"
      ).then((m) => m.SubscriberCertificateRoutingModule),
  },
  {
    path: "certificate-request",
    loadChildren: () =>
      import("./certificate-request/certificate-request-routing.module").then(
        (m) => m.CertificateRequestRoutingModule
      ),
  },
  {
    path: "keypair",
    loadChildren: () =>
      import("./keypair/keypair-routing.module").then(
        (m) => m.KeypairRoutingModule
      ),
  },
  {
    path: "**",
    redirectTo: "/pages/miscellaneous/error", //Error 404 - Page not found
  },
];
@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    KeypairModule,
    CertificateRequestModule,
    SubscriberCertificateModule,
  ],
  exports: [RouterModule],
})
export class TokenManagementModule {}
