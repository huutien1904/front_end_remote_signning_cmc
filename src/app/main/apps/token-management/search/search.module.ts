import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchComponent } from './search.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';
import { KeypairModule } from '../keypair/keypair.module';
import { RouterModule, Routes } from '@angular/router';
import { CertificateRequestModule } from '../certificate-request/certificate-request.module';
import { SubscriberCertificateModule } from '../subscriber-certificate/subscriber-certificate.module';

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
    ReactiveFormsModule, 
    NgSelectModule,
    ReactiveFormsModule,
    ContentHeaderModule, 
    KeypairModule,
    RouterModule.forChild(routes),
    CertificateRequestModule,
    SubscriberCertificateModule
  ],
  
})
export class SearchModule { }
