import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { NgSelectModule } from "@ng-select/ng-select";
import { CoreCommonModule } from "@core/common.module";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { CorePipesModule } from "@core/pipes/pipes.module";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { MatDatepickerModule } from "@angular/material/datepicker";
import {
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
  MomentDateAdapter,
} from "@angular/material-moment-adapter";
import {
  DateAdapter,
  MatNativeDateModule,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from "@angular/material/core";
import { MY_DATE_FORMATS } from "@core/format-data/my-date-formats";

import { HsmManagementComponent } from './hsm-management.component';
import { HsmListService } from "./hsm-list.service";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { LoadingInterceptor } from "app/main/loading/loading.interceptor";
import { LoadingService } from "app/main/loading/loading.service";
import { RouterModule, Routes } from "@angular/router";

const materialModules1234 = [
  MatDatepickerModule,
  MatNativeDateModule
];
const routes: Routes = [
  {
    path: '',
    component: HsmManagementComponent
  }
]
@NgModule({
  declarations: [HsmManagementComponent],
  imports: [
    CommonModule,
    CoreCommonModule,
    NgSelectModule,
    NgbModule,
    ...materialModules1234,
    NgxDatatableModule.forRoot({
      messages: {
        emptyMessage: 'Không có dữ liệu', // Message to show when array is presented, but contains no values
        totalMessage: 'tổng', // Footer total message
        selectedMessage: 'selected' // Footer selected message
      }
    }),
    CorePipesModule,
    MatProgressBarModule,
    RouterModule.forChild(routes),
  ],
  exports: [HsmManagementComponent],
  providers: [
    
    HsmListService,
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
        multi: true
      }
        
  ]
})
export class HsmManagementModule { }
