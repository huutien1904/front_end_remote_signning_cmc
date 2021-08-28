import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CoreCommonModule } from '@core/common.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { NewPersonalSidebarComponent } from './new-personal-sidebar.component';

@NgModule({
  declarations: [
    NewPersonalSidebarComponent   //Khai báo Component thuộc Module
    ],
  imports: [
    CommonModule,CoreCommonModule,FormsModule,
    NgSelectModule
  ],
  exports: [
    NewPersonalSidebarComponent  //Export để sử dụng được ở Module khác
  ]
})
export class NewPersonalSidebarModule { }