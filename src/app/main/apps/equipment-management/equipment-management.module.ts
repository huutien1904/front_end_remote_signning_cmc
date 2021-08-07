import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HsmManagementComponent } from './hsm-management/hsm-management.component';
import { TokenManagementComponent } from './token-management/token-management.component';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'app/auth/helpers/auth.guards';
import { Role } from 'app/auth/models/role';


const routes : Routes = [
  {
    path: 'hsm',
    component : HsmManagementComponent,
    canActivate : [AuthGuard], 
    // resolve: {
    //   uls: DashboardService
    // },
    data: {roles: [Role.SuperAdmin], animation: "HsmManagementComponent" },
  },{
    path: 'token',
    component : TokenManagementComponent,
    canActivate : [AuthGuard], 
    data: {roles: [Role.SuperAdmin], animation:''}
  }
]
@NgModule({
  declarations: [
    HsmManagementComponent,
    TokenManagementComponent
  ],
  imports: [
    CommonModule, RouterModule.forChild(routes)
  ]
})
export class EquipmentManagementModule { }
