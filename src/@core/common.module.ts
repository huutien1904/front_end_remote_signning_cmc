import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CoreDirectivesModule } from '@core/directives/directives';
import { CorePipesModule } from '@core/pipes/pipes.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ErrorInterceptor } from 'app/auth/helpers';
import { LoadingInterceptor } from 'app/main/loading/loading.interceptor';
import { LoadingService } from 'app/main/loading/loading.service';

@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    CoreDirectivesModule,
    HttpClientModule,
    CorePipesModule,
  ],
  exports: [
    CommonModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    CoreDirectivesModule,
    CorePipesModule,
    
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    LoadingService,
      {
        provide: HTTP_INTERCEPTORS,
        useClass: LoadingInterceptor,
        multi: true
      }
  ],
})
export class CoreCommonModule {}
