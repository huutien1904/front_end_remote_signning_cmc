import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CoreCommonModule } from '@core/common.module';
import { NewPersonalSidebarComponent } from './new-personal-sidebar.component';

@NgModule({
  declarations: [
    NewPersonalSidebarComponent   //Khai báo Component thuộc Module
    ],
  imports: [
    CommonModule,CoreCommonModule,
  ],
  exports: [
    NewPersonalSidebarComponent  //Export để sử dụng được ở Module khác
  ]
})
export class NewPersonalSidebarModule { }