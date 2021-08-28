import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HsmManagementComponent } from './hsm-management.component';
import { CoreCommonModule } from '@core/common.module';



@NgModule({
  declarations: [HsmManagementComponent],
  imports: [
    CommonModule,
    CoreCommonModule
  ],
  exports: [HsmManagementComponent]
})
export class HsmManagementModule { }
