import { CertificateRequestListComponent } from './certificate-request-list/certificate-request-list.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { CertificateRequestViewComponent } from './certificate-request-view/certificate-request-view.component';
import { CertificateRequestEditComponent } from './certificate-request-edit/certificate-request-edit.component';




@NgModule({
  declarations: [CertificateRequestListComponent, CertificateRequestViewComponent, CertificateRequestEditComponent],
  imports: [
    CommonModule,
    NgSelectModule,
    NgbCollapseModule,
    FormsModule
  ],
  exports:  [CertificateRequestListComponent, CertificateRequestViewComponent, CertificateRequestEditComponent],
})
export class CertificateRequestModule {}
