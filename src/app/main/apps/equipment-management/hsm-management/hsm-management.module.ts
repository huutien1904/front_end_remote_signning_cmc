import { CommonModule } from "@angular/common";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import {
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
  MomentDateAdapter
} from "@angular/material-moment-adapter";
import {
  DateAdapter,
  MatNativeDateModule,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE
} from "@angular/material/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { RouterModule } from "@angular/router";
import { CoreCommonModule } from "@core/common.module";
import { MY_DATE_FORMATS } from "@core/format-data/my-date-formats";
import { CorePipesModule } from "@core/pipes/pipes.module";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { NgSelectModule } from "@ng-select/ng-select";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { ContentHeaderModule } from "app/layout/components/content-header/content-header.module";
import { LoadingInterceptor } from "app/main/loading/loading.interceptor";
import { LoadingService } from "app/main/loading/loading.service";
import { HsmCreateComponent } from "./hsm-create/hsm-create.component";
import { HsmEditComponent } from "./hsm-edit/hsm-edit.component";
import { HsmListService } from "./hsm-list.service";
import { HsmListComponent } from "./hsm-list/hsm-list.component";
import { HsmViewComponent } from "./hsm-view/hsm-view.component";


const materialModules1234 = [
  MatDatepickerModule,
  MatNativeDateModule
];

@NgModule({
  declarations: [HsmListComponent, HsmEditComponent, HsmViewComponent, HsmCreateComponent],
  imports: [
    CommonModule,
    CoreCommonModule,
    NgSelectModule,
    RouterModule,
    NgbModule,
    ReactiveFormsModule,
    FormsModule,
    ...materialModules1234,
    NgxDatatableModule.forRoot({
      messages: {
        emptyMessage: 'Không có dữ liệu', // Message to show when array is presented, but contains no values
        totalMessage: 'tổng', // Footer total message
        selectedMessage: 'selected' // Footer selected message
      }
    }),
    CorePipesModule,
    ContentHeaderModule,
    MatProgressBarModule,
  ],
  exports: [[HsmListComponent, HsmEditComponent, HsmViewComponent]],
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
