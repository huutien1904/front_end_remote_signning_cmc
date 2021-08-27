import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';
import { RouterModule, Routes } from '@angular/router';
import { CoreCommonModule } from '@core/common.module';
import { CreateSubcribersComponent } from './create-subscribers.component';
import { OrganizationsModule } from '../subscribers/organizations/organizations.module';
import { PersonalsModule } from '../subscribers/personals/personals.module';
import { NewPersonalSidebarModule } from '../subscribers/personals/personal-list/new-personal-sidebar/new-personal-sidebar.module';

const routes:Routes = [
    {
      path:'',
      component: CreateSubcribersComponent,
    }
]

@NgModule({
    declarations: [CreateSubcribersComponent],
  
    imports: [
      CommonModule, 
      ReactiveFormsModule, 
      NgSelectModule,
      ReactiveFormsModule,
      ContentHeaderModule, 
      CoreCommonModule,
      RouterModule.forChild(routes),
      PersonalsModule,
      OrganizationsModule,
      NewPersonalSidebarModule
    ],
    
  })
export class CreateSubscribersModule { }