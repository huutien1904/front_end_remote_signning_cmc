import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NgSelectModule } from "@ng-select/ng-select";
import { FormsModule } from "@angular/forms";
import { NgbCollapseModule, NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { SubscriberCertificateListComponent } from "./subscriber-certificate-list/subscriber-certificate-list.component";
import { SubscriberCertificateViewComponent } from "./subscriber-certificate-view/subscriber-certificate-view.component";
import { SubscriberCertificateEditComponent } from "./subscriber-certificate-edit/subscriber-certificate-edit.component";
import { CoreCommonModule } from "@core/common.module";
import { SubscriberCertificateCreateComponent } from "./subscriber-certificate-create/subscriber-certificate-create.component";
import { PersonalsModule } from "../../identity-provider/subscribers/personals/personals.module";
import { FileUploadModule } from 'ng2-file-upload';

import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import {
  DateAdapter,
  MatNativeDateModule,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from "@angular/material/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import {
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from "@angular/material-moment-adapter";
import { MY_DATE_FORMATS } from "@core/format-data/my-date-formats";
import { PersonalsService } from "../certificate-request/certificate-request-new/personals/personals-list/personals.service";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { ContentHeaderModule } from "app/layout/components/content-header/content-header.module";
const materialModules1234 = [MatDatepickerModule, MatNativeDateModule];
@NgModule({
  declarations: [
    SubscriberCertificateCreateComponent,
    SubscriberCertificateListComponent,
    SubscriberCertificateViewComponent,
    SubscriberCertificateEditComponent,
    
  ],
  imports: [
    CommonModule,
    NgSelectModule,
    NgbCollapseModule,
    FormsModule,
    NgbModule,
    NgxDatatableModule.forRoot({
      messages: {
        emptyMessage: 'Không có dữ liệu', // Message to show when array is presented, but contains no values
        totalMessage: 'tổng', // Footer total message
        selectedMessage: 'selected' // Footer selected message
      }
    }),
    CoreCommonModule,
    ...materialModules1234,
    MatProgressBarModule,
    FileUploadModule,
    ContentHeaderModule
  ],
  exports: [
    SubscriberCertificateCreateComponent,
    SubscriberCertificateListComponent,
    SubscriberCertificateViewComponent,
    SubscriberCertificateEditComponent,
  ],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
  ],
})
export class SubscriberCertificateModule {}
