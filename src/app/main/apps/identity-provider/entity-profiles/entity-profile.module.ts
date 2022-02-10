import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { RouterModule } from '@angular/router';
import { CoreCommonModule } from '@core/common.module';
import { CoreSidebarModule } from "@core/components";
import { MY_DATE_FORMATS } from "@core/format-data/my-date-formats";
import { CorePipesModule } from '@core/pipes/pipes.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';
import { ReturnModule } from 'app/layout/components/return/return.module';
import { EntityProfileCreateComponent } from './entity-profile-create/entity-profile-create.component';
import { ProfileEditComponent } from './entity-profile-edit/entity-profile-edit.component';
import { ProfileListComponent } from './entity-profile-list/entity-profile-list.component';
import { EntityProfileViewComponent } from './entity-profile-view/entity-profile-view.component';

const materialModules1234 = [
  MatDatepickerModule,
  MatNativeDateModule
];

@NgModule({
  declarations: [
    ProfileListComponent,
    ProfileEditComponent,
    EntityProfileCreateComponent,
    EntityProfileViewComponent,
  ],
  exports: [
    ProfileEditComponent,
    ProfileListComponent,
  ],
  imports: [
    ...materialModules1234,
    CoreSidebarModule,
    CommonModule, 
    RouterModule , 
    NgSelectModule,
    CoreCommonModule,
    NgbModule,
    ContentHeaderModule,
    NgxDatatableModule,
    FormsModule,
    CorePipesModule,
    ReactiveFormsModule,
    ReturnModule,
    SweetAlert2Module.forRoot()
  ],
  // schemas :[
  //   NO_ERRORS_SCHEMA,
  //   CUSTOM_ELEMENTS_SCHEMA
  // ],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
    
  ]
})
export class ProfileModule { }
