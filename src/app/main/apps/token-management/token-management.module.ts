import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import { SearchComponent } from "./search.component";
/**
 * Routing
 */

const routes: Routes = [
  {
    path: 'search',
    component: SearchComponent
  },
  {
    path: 'subscriber-certificate',
    loadChildren: () => import('./subscriber-certificate/subscriber-certificate.module').then(m => m.SubscriberCertificateModule)
  },
  {
    path: 'certificate-request',
    loadChildren: () => import('./certificate-request/certificate-request.module').then(m => m.CertificateRequestModule)
  },
  {
    path: 'keypair',
    loadChildren: () => import('./keypair/keypair.module').then(m => m.KeypairModule)
  },
  {
    path: "**",
    redirectTo: "/pages/miscellaneous/error", //Error 404 - Page not found
  },
]
@NgModule({
  declarations: [

  ],
  imports: [CommonModule, RouterModule.forChild(routes)],
})
export class TokenManagementModule {}
