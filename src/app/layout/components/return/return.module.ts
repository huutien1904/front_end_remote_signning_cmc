import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReturnComponent } from './return.component';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CoreCommonModule } from '@core/common.module';
import { BreadcrumbModule } from 'app/layout/components/content-header/breadcrumb/breadcrumb.module';
import { BreadcrumbsModule } from './breadcrumbs/breadcrumbs.module';

@NgModule({
  declarations: [ReturnComponent],
  imports: [
    CommonModule,
    // NgModule,
    CoreCommonModule,
    NgbModule,
    RouterModule,
    BreadcrumbsModule,
    
  ],
  exports: [ReturnComponent]
})
export class ReturnModule {}
