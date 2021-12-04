import { CommonModule } from "@angular/common";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
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
import { RouterModule } from "@angular/router";
import { CoreCommonModule } from "@core/common.module";
import { CoreSidebarModule } from "@core/components";
import { MY_DATE_FORMATS } from "@core/format-data/my-date-formats";
import { CorePipesModule } from "@core/pipes/pipes.module";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { NgSelectModule } from "@ng-select/ng-select";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { LoadingInterceptor } from "app/main/loading/loading.interceptor";
import { LoadingService } from "app/main/loading/loading.service";
import { PersonalEditComponent } from "./personal-edit/personal-edit.component";
import { PersonalEditService } from "./personal-edit/personal-edit.service";
import { NewPersonalSidebarComponent } from "./personal-list/new-personal-sidebar/new-personal-sidebar.component";
import { PersonalListAddComponent } from './personal-list/personal-list-add/personal-list-add.component';
import { PersonalListComponent } from "./personal-list/personal-list.component";
import { PersonalListService } from "./personal-list/personal-list.service";
import { PersonalViewComponent } from "./personal-view/personal-view.component";
import { PersonalViewService } from "./personal-view/personal-view.service";
import { SidebarPersonalEditComponent } from './personal-list/sidebar-personal-edit/sidebar-personal-edit.component';
const materialModules1234 = [
  MatDatepickerModule,
  MatNativeDateModule,
];

@NgModule({
  declarations: [
    PersonalListComponent,
    PersonalViewComponent,
    PersonalEditComponent,
    NewPersonalSidebarComponent,
    PersonalListAddComponent,
    SidebarPersonalEditComponent,
  ],
  imports: [
    CommonModule,
    CoreCommonModule,
    FormsModule,
    NgbModule,
    NgSelectModule,
    NgxDatatableModule.forRoot({
      messages: {
        emptyMessage: 'Không có dữ liệu', // Message to show when array is presented, but contains no values
        totalMessage: 'tổng', // Footer total message
        selectedMessage: 'selected' // Footer selected message
      }
    }),
    CorePipesModule,
    CoreSidebarModule,
    RouterModule,
    ...materialModules1234,
    
    
  ],
  exports: [
    PersonalListComponent,
    PersonalViewComponent,
    PersonalEditComponent,
    NewPersonalSidebarComponent,
    
  ],
  providers: [
    PersonalEditService,
    PersonalListService,
    PersonalViewService,
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
  ],
})
export class PersonalsModule {}
