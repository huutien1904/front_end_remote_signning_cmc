import { CommonModule } from '@angular/common';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CoreCommonModule } from '@core/common.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { NewPersonalSidebarComponent } from './new-personal-sidebar.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { CoreSidebarModule } from '@core/components';
@NgModule({
  declarations: [
    NewPersonalSidebarComponent   
    ],
  imports: [
    CommonModule,CoreCommonModule,FormsModule,
    NgSelectModule,NgbModule,CoreSidebarModule
  ],
  exports: [
    NewPersonalSidebarComponent 
  ],
  bootstrap: [NewPersonalSidebarComponent]
,
})
export class NewPersonalSidebarModule { }