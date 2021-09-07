import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';
import { CoreCommonModule } from '@core/common.module';
import { CertificateRequestNewComponent } from './certificate-request-new.component';
import { OrganizationsModule } from './organizations/organizations.module';
import { PersonalsModule } from './personals/personals-list/personals.module';

const routes: Routes = [
  {
    path: '',
    component: CertificateRequestNewComponent
  }
]

@NgModule({
  declarations: [CertificateRequestNewComponent],
  imports: [
    CommonModule,
    NgSelectModule,
    ContentHeaderModule,
    CoreCommonModule,
    RouterModule.forChild(routes),
    OrganizationsModule,
    PersonalsModule
  ]
})
export class CertificateRequestNewModule { }
