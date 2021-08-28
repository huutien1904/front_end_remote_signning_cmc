import { CertificateRequestListComponent } from "./certificate-request-list/certificate-request-list.component";
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { NgbCollapseModule } from "@ng-bootstrap/ng-bootstrap";
import { NgSelectModule } from "@ng-select/ng-select";
import { CertificateRequestViewComponent } from "./certificate-request-view/certificate-request-view.component";
import { CertificateRequestEditComponent } from "./certificate-request-edit/certificate-request-edit.component";
import { CoreCommonModule } from "@core/common.module";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { CertificateRequestCreateComponent } from "./certificate-request-create/certificate-request-create.component";

@NgModule({
  declarations: [
    CertificateRequestListComponent,
    CertificateRequestViewComponent,
    CertificateRequestEditComponent,
    CertificateRequestCreateComponent,
  ],
  imports: [
    CommonModule,
    NgSelectModule,
    NgbCollapseModule,
    FormsModule,
    CoreCommonModule,
    NgbModule,
  ],
  exports: [
    CertificateRequestListComponent,
    CertificateRequestViewComponent,
    CertificateRequestEditComponent,
    CertificateRequestCreateComponent,
  ],
})
export class CertificateRequestModule {}
