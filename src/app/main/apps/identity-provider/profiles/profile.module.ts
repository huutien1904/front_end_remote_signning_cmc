import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileListComponent } from './profile-list/profile-list.component';
import { RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { CoreCommonModule } from '@core/common.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ProfileSidebarComponent } from './profile-list/profile-sidebar/profile-sidebar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';
import { CoreSidebarModule } from "@core/components";
import { CorePipesModule } from '@core/pipes/pipes.module';
import { ProfileEditComponent } from './profile-edit/profile-edit.component';
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
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { LoadingInterceptor } from 'app/main/loading/loading.interceptor';
import { LoadingService } from 'app/main/loading/loading.service';

const materialModules1234 = [
  MatDatepickerModule,
  MatNativeDateModule
];

@NgModule({
  declarations: [
    ProfileListComponent,
    ProfileEditComponent,
    ProfileSidebarComponent
  ],
  exports: [
    ProfileEditComponent,
    ProfileListComponent,
    ProfileSidebarComponent,
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
  ],
  schemas :[
    NO_ERRORS_SCHEMA,
    CUSTOM_ELEMENTS_SCHEMA
  ],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
    LoadingService,
      {
        provide: HTTP_INTERCEPTORS,
        useClass: LoadingInterceptor,
        multi: true
      }
  ]
})
export class ProfileModule { }
