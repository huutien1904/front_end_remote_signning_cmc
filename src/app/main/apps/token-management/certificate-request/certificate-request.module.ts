import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { NgSelectModule } from "@ng-select/ng-select";
import { CoreCommonModule } from "@core/common.module";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
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
import { CertificateRequestListComponent } from "./certificate-request-list/certificate-request-list.component";
import { CertificateRequestListService} from './certificate-request-list/certificate-request-list.service'
import { FormsModule } from "@angular/forms";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { CorePipesModule } from "@core/pipes/pipes.module";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { ContentHeaderModule } from "app/layout/components/content-header/content-header.module";
import { RouterModule } from "@angular/router";
import { CoreCardModule } from "@core/components/core-card/core-card.module";
import { CertificateRequestViewComponent } from "./certificate-request-view/certificate-request-view.component";
const materialModules1234 = [
  MatDatepickerModule,
  MatNativeDateModule
];

@NgModule({
  declarations: [
    CertificateRequestListComponent,
    CertificateRequestViewComponent
  ],
  imports: [
    CommonModule,
    NgSelectModule,
    CoreCommonModule,
    NgbModule,
    ...materialModules1234,
    FormsModule,
    NgxDatatableModule.forRoot({
      messages: {
        emptyMessage: 'Không có dữ liệu', // Message to show when array is presented, but contains no values
        totalMessage: 'tổng', // Footer total message
        selectedMessage: 'selected' // Footer selected message
      }
    }),
    CorePipesModule,
    MatProgressBarModule,
    ContentHeaderModule,
    RouterModule,
    CoreCardModule,
  ],
  exports: [
    CertificateRequestListComponent,
    
  ],
  providers: [
    CertificateRequestListService,
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
  ]
})
export class CertificateRequestModule {}
