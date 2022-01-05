import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterModule, Routes } from '@angular/router';

import { HsmManagementModule } from './hsm-management/hsm-management.module';
import { TemplateComponent } from './template/template.component';
import { TokenManagementModule } from './token-management/token-management.module';

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
    component: TemplateComponent,
  },
  {
    path: '**',
    redirectTo: '/pages/miscellaneous/error', //Error 404 - Page not found
  },
];
@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatProgressSpinnerModule,
    HsmManagementModule,
    TokenManagementModule,
  ],
  providers: [],
})
export class EquipmentManagementModule {}
