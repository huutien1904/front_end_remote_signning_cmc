import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { LoadingInterceptor } from './../../loading/loading.interceptor';
import { LoadingService } from './../../loading/loading.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { HsmManagementComponent } from './hsm-management/hsm-management.component';


const routes : Routes = [
  {
    path: 'hsm',
    loadChildren: () => import('./hsm-management/hsm-management.module').then(m => m.HsmManagementModule)
  },
  {
    path: 'token',
    loadChildren: () => import('./token-management/token-management.module').then(m => m.TokenManagementModule)
  },
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
  
  // {
  //   path: 'hsm',
  //   // loadChildren: () => import('./hsm-management/hsm-management.component').then(m => m.HsmManagementComponent)
  //   component : HsmManagementComponent,
  //   // canActivate : [AuthGuard], 
  //   // resolve: {
  //   //   uls: DashboardService
  //   // },
  //   // data: {roles: [Role.SuperAdmin], animation: "HsmManagementComponent" },
  // },
  // {
  //   path: 'token',
  //   loadChildren: () => import('./token-management/token-management.component').then(m => m.TokenManagementComponent)
  //   // component : TokenManagementComponent,
  //   // canActivate : [AuthGuard], 
  //   // data: {roles: [Role.SuperAdmin], animation:''}
  // }
  
]
@NgModule({
  declarations: [
  
  ],
  imports: [
    CommonModule, 
    RouterModule.forChild(routes),
    MatProgressSpinnerModule,
    
  ],
  providers: [
    
  ],

})
export class EquipmentManagementModule { }
