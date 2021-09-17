import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SubscriberCertificateNewComponent } from './subscriber-certificate-new.component';
import { CoreCommonModule } from '@core/common.module';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { OrganizationsComponent } from './organizations/organizations.component';
import { PersonalsModule } from './personals/personals-list/personals.module';
import { OrganizationsModule } from './organizations/organizations.module';


const routes: Routes = [
  {
    path: '',
    component: SubscriberCertificateNewComponent
  }
]
@NgModule({
  declarations: [SubscriberCertificateNewComponent,],
  imports: [
    CommonModule,
    NgSelectModule,
    ContentHeaderModule,
    CoreCommonModule,
    RouterModule.forChild(routes),
    PersonalsModule,
    OrganizationsModule
  ]
})
export class SubscriberCertificateNewModule { }
