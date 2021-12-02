import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileListComponent } from './profile-list/profile-list.component';
import { RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { CoreCommonModule } from '@core/common.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ProfileSidebarComponent } from './profile-list/profile-sidebar/profile-sidebar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';
import { CoreSidebarModule } from "@core/components";
import { CorePipesModule } from '@core/pipes/pipes.module';
import { ProfileEditComponent } from './profile-edit/profile-edit.component';
@NgModule({
  declarations: [
    ProfileListComponent,
    ProfileEditComponent,
    ProfileSidebarComponent
  ],
  exports: [
    ProfileEditComponent,
    ProfileListComponent,
    ProfileSidebarComponent,
  ],
  imports: [
    CoreSidebarModule,
    CommonModule, 
    RouterModule , 
    NgSelectModule,
    CoreCommonModule,
    NgbModule,
    ContentHeaderModule,
    NgxDatatableModule,
    FormsModule,
    CorePipesModule,
    ReactiveFormsModule 
  ],
})
export class ProfileModule { }
