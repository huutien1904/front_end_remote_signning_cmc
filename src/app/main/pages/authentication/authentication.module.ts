import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { CoreCommonModule } from '@core/common.module';

import { AuthLoginV2Component } from 'app/main/pages/authentication/auth-login-v2/auth-login-v2.component';
import { AuthRegisterV2Component } from 'app/main/pages/authentication/auth-register-v2/auth-register-v2.component';
import { AuthForgotPasswordV2Component } from 'app/main/pages/authentication/auth-forgot-password-v2/auth-forgot-password-v2.component';
import { NgSelectModule } from '@ng-select/ng-select';



// routing
const routes: Routes = [
  {
    path: 'authentication/login',
    component: AuthLoginV2Component,
    data: { animation: 'auth' }
  },
  {
    path: 'authentication/register-v2',
    component: AuthRegisterV2Component
  },
  {
    path: 'authentication/forgot-password-v2',
    component: AuthForgotPasswordV2Component
  }
];

@NgModule({
  declarations: [
    AuthLoginV2Component,
    AuthRegisterV2Component,
    AuthForgotPasswordV2Component
  ],
  imports: [CommonModule, RouterModule.forChild(routes), NgbModule, FormsModule, ReactiveFormsModule, CoreCommonModule, NgSelectModule]
})
export class AuthenticationModule {}
