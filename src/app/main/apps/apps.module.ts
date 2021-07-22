import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';


const routes:Routes = [
  {
    path: 'ip',
    loadChildren: () => import('./identity-provider/identity-provider.module').then(m => m.IdentityProviderModule)
  }
]
@NgModule({
  declarations: [],
  imports: [
    CommonModule, RouterModule.forChild(routes),
  ]
})
export class AppsModule { }
