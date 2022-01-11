import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
  MomentDateAdapter
} from '@angular/material-moment-adapter';
import {
  DateAdapter,
  MatNativeDateModule,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE
} from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { RouterModule } from '@angular/router';
import { CoreCommonModule } from '@core/common.module';
import { MY_DATE_FORMATS } from '@core/format-data/my-date-formats';
import { CorePipesModule } from '@core/pipes/pipes.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';
import { TokenCreateComponent } from './token-create/token-create.component';
import { TokenEditComponent } from './token-edit/token-edit.component';
import { TokenListComponent } from './token-list/token-list.component';
import { TokenViewComponent } from './token-view/token-view.component';
import { TokenService } from './token.service';

const materialModules1234 = [MatDatepickerModule, MatNativeDateModule];

@NgModule({
  declarations: [
    TokenViewComponent,
    TokenListComponent,
    TokenCreateComponent,
    TokenEditComponent,
  ],
  imports: [
    CommonModule,
    CoreCommonModule,
    NgSelectModule,
    NgbModule,
    ...materialModules1234,
    RouterModule,
    CorePipesModule,
    MatProgressBarModule,
    FormsModule,
    ContentHeaderModule,
    NgxDatatableModule.forRoot({
      messages: {
        emptyMessage: 'Không có dữ liệu', // Message to show when array is presented, but contains no values
        totalMessage: 'tổng', // Footer total message
        selectedMessage: 'selected', // Footer selected message
      },
    }),
    SweetAlert2Module.forRoot()
  ],
  exports: [
    TokenViewComponent,
    TokenListComponent,
    TokenCreateComponent,
    TokenEditComponent,
  ],
  // schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
  providers: [
    TokenService,
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
  ],
})
export class TokenManagementModule {}
