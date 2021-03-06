import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { MonitorlogComponent } from './monitorlog/monitorlog.component';
import { MonitorlogComponent } from './monitorlog/monitorlog.component';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'app/auth/helpers';
import { Role } from 'app/auth/models';
import { ConfigurationComponent } from './configuration/configuration.component';
import { IntroduceComponent } from './introduce/introduce.component';
import { HelpCenterComponent } from './help-center/help-center.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { FormsModule } from '@angular/forms';
import { CoreCommonModule } from '@core/common.module';




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
  },
  {
    path: 'introduction',
    component:IntroduceComponent,
  },
  {
    path: 'help-center',
    component:HelpCenterComponent,
  },
  {
    path: "**",
    redirectTo: "/pages/miscellaneous/error", //Error 404 - Page not found
  }
]
@NgModule({
  declarations: [IntroduceComponent, HelpCenterComponent],
  imports: [
    CommonModule, RouterModule.forChild(routes),
    NgbModule,NgSelectModule,SweetAlert2Module,FormsModule, CoreCommonModule
  ],
  exports: [IntroduceComponent],
})
export class SystemManagementModule { }
