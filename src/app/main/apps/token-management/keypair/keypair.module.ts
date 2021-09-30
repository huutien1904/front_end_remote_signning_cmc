import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { CoreCommonModule } from "@core/common.module";
import { NgbCollapseModule, NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { NgSelectModule } from "@ng-select/ng-select";
import { KeypairEditComponent } from "./keypair-edit/keypair-edit.component";
import { KeypairListComponent } from "./keypair-list/keypair-list.component";
import { KeypairViewComponent } from "./keypair-view/keypair-view.component";
import { KeypairCreateComponent } from './keypair-create/keypair-create.component';
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
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { CorePipesModule } from "@core/pipes/pipes.module";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { ListSidebarComponent } from './keypair-list/list-sidebar/list-sidebar.component';
import { ContentHeaderModule } from "app/layout/components/content-header/content-header.module";

const materialModules1234 = [
  MatDatepickerModule,
  MatNativeDateModule
];


@NgModule({
  declarations: [
    KeypairListComponent,
    KeypairViewComponent,
    KeypairEditComponent,
    KeypairCreateComponent,
    ListSidebarComponent,
  ],
  imports: [
    CommonModule,
    NgSelectModule,
    NgbCollapseModule, 
    FormsModule,
    CoreCommonModule,
    NgbModule,
    ...materialModules1234,
    NgxDatatableModule.forRoot({
      messages: {
        emptyMessage: 'Không có dữ liệu', // Message to show when array is presented, but contains no values
        totalMessage: 'tổng', // Footer total message
        selectedMessage: 'selected' // Footer selected message
      }
    }),
    CorePipesModule,
    MatProgressBarModule,
    ContentHeaderModule
  ],
  exports: [KeypairListComponent, KeypairViewComponent, KeypairEditComponent, ListSidebarComponent],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
  ]
})
export class KeypairModule {}
