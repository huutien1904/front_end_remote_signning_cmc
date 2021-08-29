import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';


const routes : Routes = [
  {
    path: 'search',
    loadChildren: () => import('./search/search.module').then(m => m.SearchModule)
  },
  {
    path: 'new-hsm',
    loadChildren: () => import('./new-hsm/new-hsm.module').then(m => m.NewHsmModule)
  },
  {
    path: 'new-token',
    loadChildren: () => import('./new-token/new-token.module').then(m => m.NewTokenModule)
  },
  /*
  {
    path: 'hsm',
    component : HsmManagementComponent,
    canActivate : [AuthGuard], 
    // resolve: {
    //   uls: DashboardService
    // },
    data: {roles: [Role.SuperAdmin], animation: "HsmManagementComponent" },
  },
  {
    path: 'token',
    component : TokenManagementComponent,
    canActivate : [AuthGuard], 
    data: {roles: [Role.SuperAdmin], animation:''}
  }
  */
]
@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule, RouterModule.forChild(routes)
  ]
})
export class EquipmentManagementModule { }
