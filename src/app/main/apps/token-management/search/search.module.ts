import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CoreCommonModule } from '@core/common.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';
import { CertificateRequestModule } from '../certificate-request/certificate-request.module';
import { KeypairModule } from '../keypair/keypair.module';
import { SubscriberCertificateModule } from '../subscriber-certificate/subscriber-certificate.module';
import { SearchComponent } from './search.component';

const routes:Routes = [
  {
    path:'',
    component: SearchComponent,
  }
]
@NgModule({
  declarations: [SearchComponent],

  imports: [
    CommonModule, 
    CoreCommonModule,
    NgSelectModule,
    ContentHeaderModule, 
    KeypairModule,
    RouterModule.forChild(routes),
    CertificateRequestModule,
    SubscriberCertificateModule
  ],
  
})
export class SearchModule { }
