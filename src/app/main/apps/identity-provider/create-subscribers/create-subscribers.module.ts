import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';
import { RouterModule, Routes } from '@angular/router';
import { CoreCommonModule } from '@core/common.module';
import { CreateSubscribersComponent } from './create-subscribers.component';
import { OrganizationsModule } from '../subscribers/organizations/organizations.module';
import { PersonalsModule } from '../subscribers/personals/personals.module';
import { PersonalListCreateComponent } from './personal-list-create/personal-list-create.component';
import { OrganizationListCreateComponent } from './organization-list-create/organization-list-create.component';
const routes:Routes = [
    {
      path:'',
      component: CreateSubscribersComponent,
    }
]

@NgModule({
    declarations: [CreateSubscribersComponent, PersonalListCreateComponent, OrganizationListCreateComponent],
  
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
      NgxDatatableModule
    ],
    
  })
export class CreateSubscribersModule { }