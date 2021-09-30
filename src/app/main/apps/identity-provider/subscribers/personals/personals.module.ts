import { CommonModule } from "@angular/common";
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
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { RouterModule } from "@angular/router";
import { CoreCommonModule } from "@core/common.module";
import { CoreSidebarModule } from "@core/components";
import { MY_DATE_FORMATS } from "@core/format-data/my-date-formats";
import { CorePipesModule } from "@core/pipes/pipes.module";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { NgSelectModule } from "@ng-select/ng-select";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { PersonalEditComponent } from "./personal-edit/personal-edit.component";
import { PersonalEditService } from "./personal-edit/personal-edit.service";
import { NewPersonalSidebarComponent } from "./personal-list/new-personal-sidebar/new-personal-sidebar.component";
import { PersonalListComponent } from "./personal-list/personal-list.component";
import { PersonalListService } from "./personal-list/personal-list.service";
import { PersonalViewComponent } from "./personal-view/personal-view.component";
import { PersonalViewService } from "./personal-view/personal-view.service";
import { AppRemoveSpace } from './remove-space.directive';
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
    AppRemoveSpace,
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
    MatProgressBarModule,
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
  ],
})
export class PersonalsModule {}
