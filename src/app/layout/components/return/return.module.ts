import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReturnComponent } from './return.component';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CoreCommonModule } from '@core/common.module';
import { BreadcrumbModule } from 'app/layout/components/content-header/breadcrumb/breadcrumb.module';

@NgModule({
  declarations: [ReturnComponent],
  imports: [
    CommonModule,
    // NgModule,
    BreadcrumbModule,
    CoreCommonModule,
    NgbModule,
    RouterModule,
  ],
  exports: [ReturnComponent]
})
export class ReturnModule {}
