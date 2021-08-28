import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreCommonModule } from '@core/common.module';
import { NewHsmComponent } from './new-hsm.component';
import { RouterModule, Routes } from '@angular/router';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';

const routes: Routes = [
  {
    path: '',
    component: NewHsmComponent
  }
]

@NgModule({
  declarations: [
    NewHsmComponent
  ],
  imports: [
    CommonModule,
    CoreCommonModule,
    RouterModule.forChild(routes),
    ContentHeaderModule
  ]
})
export class NewHsmModule { }
