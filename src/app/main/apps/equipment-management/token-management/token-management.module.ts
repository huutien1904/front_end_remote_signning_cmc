import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TokenManagementComponent } from './token-management.component';
import { CoreCommonModule } from '@core/common.module';



@NgModule({
  declarations: [TokenManagementComponent],
  imports: [
    CommonModule,
    CoreCommonModule
  ],
  exports: [TokenManagementComponent]
})
export class TokenManagementModule { }
