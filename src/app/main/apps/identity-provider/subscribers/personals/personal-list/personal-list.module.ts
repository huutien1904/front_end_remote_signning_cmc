import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PersonalListComponent } from "./personal-list.component";
import { CoreCommonModule } from "@core/common.module";
import { RouterModule } from "@angular/router";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { NgSelectModule } from "@ng-select/ng-select";
import { PersonalRoutingModule } from "../personal-routing.module";
import { MatNativeDateModule } from "@angular/material/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MY_DATE_FORMATS } from '@core/format-data/my-date-formats';

const materialModules1234 = [
  MatDatepickerModule,
  MatFormFieldModule,
  MatInputModule,
  MatNativeDateModule,
  
];
@NgModule({
  imports: [CommonModule, CoreCommonModule, RouterModule, 
    NgbModule,NgSelectModule,PersonalRoutingModule,...materialModules1234],
  declarations: [PersonalListComponent],
  providers: [
      {
        provide: DateAdapter,
        useClass: MomentDateAdapter,
        deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
      },
  { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }
    ],
  exports: [PersonalListComponent, ],
})
export class PersonalListModule {}