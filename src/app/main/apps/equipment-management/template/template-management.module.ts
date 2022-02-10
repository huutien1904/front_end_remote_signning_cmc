import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TemplateCreateComponent } from './template-create/template-create.component';
import { TemplateEditComponent } from './template-edit/template-edit.component';
import { TemplateListComponent } from './template-list/template-list.component';
import { TemplateViewComponent } from './template-view/template-view.component';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DateAdapter, MatNativeDateModule, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { CorePipesModule } from '@core/pipes/pipes.module';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { MY_DATE_FORMATS } from '@core/format-data/my-date-formats';
import { TemplateService } from './template.service';
import { RouterModule } from '@angular/router';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { CoreDirectivesModule } from '@core/directives/directives';


const materialModules1234 = [
  MatDatepickerModule,
  MatNativeDateModule
];
@NgModule({
  declarations: [
    TemplateListComponent,
    TemplateCreateComponent,
    TemplateEditComponent,
    TemplateViewComponent
  ],
  imports: [
    CommonModule,
    ContentHeaderModule,
    ReactiveFormsModule,
    ...materialModules1234,
    NgbModule ,
    NgSelectModule,
    CorePipesModule,
    RouterModule,
    NgxDatatableModule,
    FormsModule,
    MatProgressBarModule,
    SweetAlert2Module.forRoot(),
    CoreDirectivesModule 
  ],
  providers: [
    
    TemplateService,
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
    
        
  ]
})
export class TemplateManagementModule { }
