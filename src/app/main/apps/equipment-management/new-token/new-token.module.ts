import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreCommonModule } from '@core/common.module';
import { NewTokenComponent } from './new-token.component';
import { RouterModule, Routes } from '@angular/router';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';
import { NgSelectModule } from '@ng-select/ng-select';
import {  HTTP_INTERCEPTORS } from '@angular/common/http';
import { LoadingInterceptor } from 'app/main/loading/loading.interceptor';
import { LoadingService } from 'app/main/loading/loading.service';

const routes: Routes = [
  {
    path: '',
    component: NewTokenComponent
  }
]

@NgModule({
  declarations: [NewTokenComponent],
  imports: [
    CommonModule,
    CoreCommonModule,
    RouterModule.forChild(routes),
    ContentHeaderModule,
    NgSelectModule,
    
  ],
  providers: [
    LoadingService,
      {
        provide: HTTP_INTERCEPTORS,
        useClass: LoadingInterceptor,
        multi: true
      }
  ],
})
export class NewTokenModule { }
