import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HsmManagementComponent } from './hsm-management.component';
import { CoreCommonModule } from '@core/common.module';
import { Routes, RouterModule } from '@angular/router';
import { NewHsmComponent } from '../new-hsm/new-hsm.component';
import { NgbCollapseModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { NewTokenModule } from '../new-token/new-token.module';

const routes: Routes = [
  {
    path: 'new-hsm',
    component: NewHsmComponent,
  },
  {
    path: 'new-token',
    component: NewTokenModule
  }
]

@NgModule({
  declarations: [HsmManagementComponent],
  imports: [
    CommonModule,
    CoreCommonModule,
    RouterModule.forChild(routes),
    NgbCollapseModule,
    NgSelectModule,
    NgbModule
  ],
  exports: [HsmManagementComponent]
})
export class HsmManagementModule { }
