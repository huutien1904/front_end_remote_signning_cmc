import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';
import { SearchComponent } from './search.component';
import { HsmManagementModule } from '../hsm-management/hsm-management.module';
import { TokenManagementModule } from '../token-management/token-management.module';
import { CoreCommonModule } from '@core/common.module';

const routes: Routes = [
  {
    path: '',
    component: SearchComponent
  }
]

@NgModule({
  declarations: [SearchComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    NgSelectModule,
    ContentHeaderModule,
    HsmManagementModule,
    TokenManagementModule,
    CoreCommonModule
  ]
})
export class SearchModule { }
