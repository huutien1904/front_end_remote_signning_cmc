import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import {
  MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter
} from "@angular/material-moment-adapter";
import {
  DateAdapter,
  MatNativeDateModule,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE
} from "@angular/material/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { CoreCommonModule } from "@core/common.module";
import { MY_DATE_FORMATS } from "@core/format-data/my-date-formats";
import { NgbCollapseModule, NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { NgSelectModule } from "@ng-select/ng-select";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { ContentHeaderModule } from "app/layout/components/content-header/content-header.module";
import { FileUploadModule } from 'ng2-file-upload';
import { PersonalService } from "../../identity-provider/subscribers/personals/personal.service";
import { KeypairService } from "../keypair/keypair.service";
import { SubscriberCertificateCreateComponent } from "./subscriber-certificate-create/subscriber-certificate-create.component";
import { SubscriberCertificateEditComponent } from "./subscriber-certificate-edit/subscriber-certificate-edit.component";
import { SubscriberCertificateListComponent } from "./subscriber-certificate-list/subscriber-certificate-list.component";
import { SubscriberCertificateListService } from "./subscriber-certificate-list/subscriber-certificate-list.service";
import { SubscriberCertificateViewComponent } from "./subscriber-certificate-view/subscriber-certificate-view.component";

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
    ContentHeaderModule,
    
  ],
  exports: [
    SubscriberCertificateCreateComponent,
    SubscriberCertificateListComponent,
    SubscriberCertificateViewComponent,
    SubscriberCertificateEditComponent,
  ],
  providers: [
    SubscriberCertificateListService,
    PersonalService,
    KeypairService,
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
  ],
})
export class SubscriberCertificateModule {}
