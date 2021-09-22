import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'app/auth/helpers';
import { Role } from 'app/auth/models';
import { DashboardComponent } from './dashboard/dashboard.component';



const routes:Routes = [
  
  {
    path: 'ip',
    // loadChildren: () => import('./token-management/token-management.module').then(m => m.TokenManagementModule),
    loadChildren: () => import('./identity-provider/identity-provider.module').then(m => m.IdentityProviderModule),
    
  },
  {
    path: 'tm',
    loadChildren: () => import('./token-management/token-management.module').then(m => m.TokenManagementModule)
  },
  {
    path: 'dashboard',
    component : DashboardComponent,
    // canActivate : [AuthGuard], 
    // resolve: {
    //   uls: DashboardService
    // },
    // data: {roles: [Role.SuperAdmin], animation: "DashboardComponent" },
  },
  {
    path: 'equipment-management',
    loadChildren: () => import('./equipment-management/equipment-management.module').then(m => m.EquipmentManagementModule)
  },
  {
    path: 'system-management',
    loadChildren: () => import('./system-management/system-management.module').then(m => m.SystemManagementModule)
  },
  {
    path: "**",
    redirectTo: "/pages/miscellaneous/error", //Error 404 - Page not found
  },
]
@NgModule({
  declarations: [],
  imports: [
    CommonModule, RouterModule.forChild(routes),
  ],
  providers : [],
})
export class AppsModule { }
