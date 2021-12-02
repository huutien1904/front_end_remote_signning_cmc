import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchSubscriberComponent } from './search-subscriber.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';
import { RouterModule, Routes } from '@angular/router';
import { CoreCommonModule } from '@core/common.module';
import { PersonalsModule } from '../subscribers/personals/personals.module';
import { OrganizationsModule } from '../subscribers/organizations/organizations.module';
import { ProfileModule } from '../subscribers/profiles/profile.module';
const routes:Routes = [
    {
      path:'',
      component: SearchSubscriberComponent,
    }
]

@NgModule({
    declarations: [SearchSubscriberComponent],
  
    imports: [
      RouterModule.forChild(routes),
      CommonModule, 
      ReactiveFormsModule, 
      NgSelectModule,
      ReactiveFormsModule,
      ContentHeaderModule, 
      CoreCommonModule,
      PersonalsModule,
      OrganizationsModule,
      ProfileModule
    ],
    exports:[SearchSubscriberComponent]
    
  })
export class SearchSubscribersModule { }