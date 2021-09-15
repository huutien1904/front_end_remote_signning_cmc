import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { NgSelectModule } from "@ng-select/ng-select";
import { CoreCommonModule } from "@core/common.module";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { Ng2FlatpickrModule } from "ng2-flatpickr";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
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
import { CertificateRequestCreateComponent } from "./certificate-request-create/certificate-request-create.component";
import { CertificateRequestListComponent } from "./certificate-request-list/certificate-request-list.component";
import { CertificateRequestListService} from './certificate-request-list/certificate-request-list.service'
import { CertificateRequestViewComponent } from "./certificate-request-view/certificate-request-view.component";
import { CertificateRequestEditComponent } from "./certificate-request-edit/certificate-request-edit.component";
const materialModules1234 = [
  MatDatepickerModule,
  MatFormFieldModule,
  MatInputModule,
  MatNativeDateModule,
];

@NgModule({
  declarations: [
    CertificateRequestListComponent,
    //CertificateRequestViewComponent,
    //CertificateRequestEditComponent,
    //CertificateRequestCreateComponent,
  ],
  imports: [
    CommonModule,
    NgSelectModule,
    CoreCommonModule,
    NgbModule,
    Ng2FlatpickrModule,
    ...materialModules1234,
  ],
  exports: [
    CertificateRequestListComponent,
    //CertificateRequestViewComponent,
    // CertificateRequestEditComponent,
    //CertificateRequestCreateComponent,
    
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
