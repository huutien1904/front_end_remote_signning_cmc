import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { MonitorlogComponent } from './monitorlog/monitorlog.component';
import { MonitorlogComponent } from './monitorlog/monitorlog.component';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'app/auth/helpers';
import { Role } from 'app/auth/models';
import { ConfigurationComponent } from './configuration/configuration.component';




const routes:Routes = [
  {
    path: 'monitorlog',
    component : MonitorlogComponent,
    canActivate : [AuthGuard], 
    data: {roles: [Role.SuperAdmin], animation:''}
  },
  {
    path: 'configuration',
    component : ConfigurationComponent,
    canActivate : [AuthGuard], 
    data: {roles: [Role.SuperAdmin], animation:''}
  }
]
@NgModule({
  declarations: [],
  imports: [
    CommonModule, RouterModule.forChild(routes),
  ]
})
export class SystemManagementModule { }
