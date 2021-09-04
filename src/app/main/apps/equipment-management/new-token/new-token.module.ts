import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreCommonModule } from '@core/common.module';
import { NewTokenComponent } from './new-token.component';
import { RouterModule, Routes } from '@angular/router';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';

const routes: Routes = [
  {
    path: '',
    component: NewTokenComponent
  }
]

@NgModule({
  declarations: [NewTokenComponent],
  imports: [
    CommonModule,
    CoreCommonModule,
    RouterModule.forChild(routes),
    ContentHeaderModule
  ]
})
export class NewTokenModule { }
