import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from 'app/auth/helpers/auth.guards';
import { DashboardService } from './dashboard/dashboard.service';
import { Role } from 'app/auth/models/role';


const routes:Routes = [
  {
    path: 'dashboard',
    component : DashboardComponent,
    canActivate : [AuthGuard], 
    // resolve: {
    //   uls: DashboardService
    // },
    data: {roles: [Role.SuperAdmin], animation: "DashboardComponent" },
  },
  {
    path: 'ip',
    loadChildren: () => import('./identity-provider/identity-provider.module').then(m => m.IdentityProviderModule),
    
  },
  {
    path: 'tm',
    loadChildren: () => import('./token-management/token-management.module').then(m => m.TokenManagementModule)
  }
]
@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule, RouterModule.forChild(routes),
  ],
  providers : [DashboardService],
})
export class AppsModule { }
