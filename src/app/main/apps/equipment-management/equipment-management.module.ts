import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterModule, Routes } from '@angular/router';
import { HsmManagementModule } from './hsm-management/hsm-management.module';
import { TokenManagementModule } from './token-management/token-management.module';
import { TemplateManagementModule } from './template/template-management.module';

const routes: Routes = [
  {
    path: 'hsm',
    loadChildren: () =>
      import('./hsm-management/hsm-management.routing').then(
        (m) => m.HsmManagementRoutes
      ),
  },
  {
    path: 'token',
    loadChildren: () =>
      import('./token-management/token-management.routing').then(
        (m) => m.TokenManagementRoutes
      ),
  },
  {
    path: 'template',
    loadChildren: () =>
      import('./template/template-management.routing').then(
        (m) => m.TemplateManagementRoutes
      ),
  },
  {
    path: '**',
    redirectTo: '/pages/miscellaneous/error', //Error 404 - Page not found
  },
];
@NgModule({
  declarations: [

  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatProgressSpinnerModule,
    HsmManagementModule,
    TokenManagementModule,
    TemplateManagementModule
  ],
  providers: [],
})
export class EquipmentManagementModule { }
