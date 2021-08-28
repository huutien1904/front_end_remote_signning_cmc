import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TokenManagementComponent } from './token-management.component';
import { CoreCommonModule } from '@core/common.module';
import { NgbCollapseModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { RouterModule, Routes } from '@angular/router';
import { NewTokenModule } from '../new-token/new-token.module';

const routes: Routes = [
  {
    path: 'new-token',
    component: NewTokenModule
  }
]

@NgModule({
  declarations: [TokenManagementComponent],
  imports: [
    CommonModule,
    CoreCommonModule,
    NgbModule,
    NgbCollapseModule,
    NgSelectModule,
    RouterModule.forChild(routes)
  ],
  exports: [TokenManagementComponent]
})
export class TokenManagementModule { }
