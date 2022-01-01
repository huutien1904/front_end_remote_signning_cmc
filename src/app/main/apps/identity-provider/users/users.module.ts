import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { RouterModule } from '@angular/router';
import { CoreCommonModule } from '@core/common.module';
import { CoreSidebarModule } from '@core/components';
import { CorePipesModule } from '@core/pipes/pipes.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ProfileComponent } from './profile/profile.component';
import { DateAdapter } from '@angular/material/core';
import {MAT_DATE_LOCALE, MAT_DATE_FORMATS} from "@angular/material/core";
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { MY_DATE_FORMATS } from "@core/format-data/my-date-formats";
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { LoadingService } from 'app/main/loading/loading.service';
import { LoadingInterceptor } from 'app/main/loading/loading.interceptor';
import { HttpClientModule } from '@angular/common/http'; 
import { CreateSelfComponent } from './create-self/create-self.component';
const materialModules1234 = [MatDatepickerModule, MatNativeDateModule];

@NgModule({
  declarations: [
    ProfileComponent,CreateSelfComponent
  ],
  imports: [
    CommonModule,
    CoreCommonModule,
    FormsModule,
    NgbModule,
    NgSelectModule,
    NgxDatatableModule,
    CorePipesModule,
    RouterModule,
    CoreSidebarModule,
    ...materialModules1234,
    HttpClientModule,
    
  ],
  exports: [
    ProfileComponent,CreateSelfComponent
  ],
  providers : [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
    LoadingService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoadingInterceptor,
      multi: true,
    },
  ]
})
export class UsersModule { }
