import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewPersonalSidebarComponent } from './new-personal-sidebar.component';

@NgModule({
  declarations: [
    NewPersonalSidebarComponent   //Khai báo Component thuộc Module
    ],
  imports: [
    CommonModule
  ],
  exports: [
    NewPersonalSidebarComponent  //Export để sử dụng được ở Module khác
  ]
})
export class ModuleNewPersonalSidebar { }