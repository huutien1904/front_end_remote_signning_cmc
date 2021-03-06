import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
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
import { SweetAlert2Module } from "@sweetalert2/ngx-sweetalert2";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { ContentHeaderModule } from "app/layout/components/content-header/content-header.module";
import { HsmCreateComponent } from "./hsm-create/hsm-create.component";
import { HsmEditComponent } from "./hsm-edit/hsm-edit.component";
import { HsmListComponent } from "./hsm-list/hsm-list.component";
import { HsmViewComponent } from "./hsm-view/hsm-view.component";
import { HsmService } from "./hsm.service";
import { HsmCreateSidebarComponent } from './hsm-create/hsm-create-sidebar/hsm-create-sidebar.component';
import { ReturnModule } from "app/layout/components/return/return.module";


const materialModules1234 = [
  MatDatepickerModule,
  MatNativeDateModule
];

@NgModule({
  declarations: [HsmListComponent, HsmEditComponent, HsmViewComponent, HsmCreateComponent, HsmCreateSidebarComponent],
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
        emptyMessage: 'Kh??ng c?? d??? li???u', // Message to show when array is presented, but contains no values
        totalMessage: 't???ng', // Footer total message
        selectedMessage: 'selected' // Footer selected message
      }
    }),
    CorePipesModule,
    ContentHeaderModule,
    ReturnModule,
    MatProgressBarModule,
    SweetAlert2Module.forRoot()
  ],
  exports: [HsmListComponent, HsmEditComponent, HsmViewComponent],
  providers: [
    
    HsmService,
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
    
        
  ]
})
export class HsmManagementModule { }
