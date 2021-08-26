import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchSubcribersComponent } from './search-subcribers.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';
import { RouterModule, Routes } from '@angular/router';
import { CoreCommonModule } from '@core/common.module';

const routes:Routes = [
    {
      path:'',
      component: SearchSubcribersComponent,
    }
]

@NgModule({
    declarations: [SearchSubcribersComponent],
  
    imports: [
      CommonModule, 
      ReactiveFormsModule, 
      NgSelectModule,
      ReactiveFormsModule,
      ContentHeaderModule, 
      CoreCommonModule,
      RouterModule.forChild(routes),
    ],
    
  })
export class SearchSubcribersModule { }