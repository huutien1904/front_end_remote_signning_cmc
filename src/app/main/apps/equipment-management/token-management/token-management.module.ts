import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { NgSelectModule } from "@ng-select/ng-select";
import { CoreCommonModule } from "@core/common.module";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
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

import { TokenManagementComponent } from './token-management.component';
import { TokenlistService } from "./tokenlist.service";

const materialModules1234 = [
  MatDatepickerModule,
  MatFormFieldModule,
  MatInputModule,
  MatNativeDateModule,
];

@NgModule({
  declarations: [TokenManagementComponent],
  imports: [
    CommonModule,
    CoreCommonModule,
    NgSelectModule,
    NgbModule,
    ...materialModules1234,
  ],
  exports: [TokenManagementComponent],
  providers: [
    TokenlistService,
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
  ]
})
export class TokenManagementModule { }
