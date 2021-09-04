import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MatNativeDateModule, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CoreCommonModule } from '@core/common.module';
import { CoreSidebarModule } from '@core/components';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { MY_DATE_FORMATS } from '@core/format-data/my-date-formats';
import { NewPersonalSidebarComponent } from './new-personal-sidebar.component';

const materialModules = [
  MatDatepickerModule,
  MatFormFieldModule,
  MatInputModule,
  MatNativeDateModule,
];
@NgModule({
  declarations: [
    NewPersonalSidebarComponent   
    ],
  imports: [
    CommonModule,CoreCommonModule,FormsModule,
    NgSelectModule,NgbModule,CoreSidebarModule,...materialModules,
  ],
  exports: [
    NewPersonalSidebarComponent 
  ],
  bootstrap: [NewPersonalSidebarComponent],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
{ provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }
  ]
})
export class NewPersonalSidebarModule { }