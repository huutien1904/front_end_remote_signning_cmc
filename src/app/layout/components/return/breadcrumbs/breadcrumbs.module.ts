import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreadcrumbsComponent } from './breadcrumbs.component';
import { CoreDirectivesModule } from '@core/directives/directives';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [BreadcrumbsComponent],
  imports: [
    CommonModule, RouterModule.forChild([]), CoreDirectivesModule
  ],
  exports: [BreadcrumbsComponent] 
})
export class BreadcrumbsModule { }
