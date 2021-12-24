import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { LoadingInterceptor } from './../../loading/loading.interceptor';
import { LoadingService } from './../../loading/loading.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { HsmManagementModule } from './hsm-management/hsm-management.module';


const routes : Routes = [
  { 
    path : 'hsm',
    loadChildren:()=> import('./hsm-management/hsm-management.routing').then(m => m.HsmManagementRoutingRoutes)
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
    path: 'new-token',
    loadChildren: () => import('./new-token/new-token.module').then(m => m.NewTokenModule)
  },
  
  
]
@NgModule({
  declarations: [
  
  ],
  imports: [
    CommonModule, 
    RouterModule.forChild(routes),
    MatProgressSpinnerModule,
    HsmManagementModule
  ],
  providers: [
    
  ],

})
export class EquipmentManagementModule { }
