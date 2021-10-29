import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreCommonModule } from '@core/common.module';
import { NewHsmComponent } from './new-hsm.component';
import { RouterModule, Routes } from '@angular/router';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CoreDirectivesModule } from '@core/directives/directives';
import { LoadingService } from 'app/main/loading/loading.service';
import { LoadingInterceptor } from 'app/main/loading/loading.interceptor';

const routes: Routes = [
  {
    path: '',
    component: NewHsmComponent
  }
]

@NgModule({
  declarations: [
    NewHsmComponent
  ],
  imports: [

    CommonModule,
    CoreCommonModule,
    RouterModule.forChild(routes),
    ContentHeaderModule,
    NgSelectModule,
    CoreDirectivesModule,
    MatProgressSpinnerModule
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
export class NewHsmModule { }
