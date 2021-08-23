// import { ModuleNewPersonalSidebar } from './subscribers/personals/personal-list/new-personal-sidebar/new-personal-sidebar.module';
import { PersonalListComponent } from './subscribers/personals/personal-list/personal-list.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'app/auth/helpers/auth.guards';
import { Role } from 'app/auth/models/role';
import {SearchSubcribersComponent} from './search-subcribers.component'
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { CoreCommonModule } from '@core/common.module';
import { UserModule } from './users/user/user.module';
import { PersonalsModule } from './subscribers/personals/personals.module';
import { OrganizationsModule } from './subscribers/organizations/organizations.module';
import { PersonalEditComponent } from './subscribers/personals/personal-edit/personal-edit.component';
import { PersonalViewComponent } from './subscribers/personals/personal-view/personal-view.component';
import { NewPersonalSidebarComponent } from './subscribers/personals/personal-list/new-personal-sidebar/new-personal-sidebar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { Ng2FlatpickrModule } from 'ng2-flatpickr';
import { CoreSidebarModule } from '@core/components';
import { CoreDirectivesModule } from '@core/directives/directives';
import { CorePipesModule } from '@core/pipes/pipes.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PersonalEditService } from './subscribers/personals/personal-edit/personal-edit.service';
import { PersonalListService } from './subscribers/personals/personal-list/personal-list.service';
import { PersonalViewService } from './subscribers/personals/personal-view/personal-view.service';
import { CreateSubcribersComponent } from './create-subcribers.component';

/**
 * Routing
 */

const routes:Routes = [
  {
    path: 'subscribers-search',
    component: SearchSubcribersComponent,
    canActivate: [AuthGuard],
    // resolve: {
    //   uls: UserListService
    // },
    // resolve: {
    //   inv:UserListService
    // },
    data: { animation: "SearchSubcribersComponent" },
  },
  
  {
    path: 'subscribers-create',
    component: CreateSubcribersComponent,
    canActivate: [AuthGuard],
    // resolve: {
    //   uls: UserListService
    // },
    // resolve: {
    //   inv:UserListService
    // },
    data: { animation: "CreateSubcribersComponent" },
  },
  {
    path: "subscribers/personals/personal-view/:id",
    component: PersonalViewComponent,
    resolve: {
      data: PersonalViewService,
    },
  },
  {
    path: 'subscribers',
    loadChildren: () => import('./subscribers/subscribers.module').then(m => m.SubscribersModule)
  },
  {
    path: "**",
    redirectTo: "/pages/miscellaneous/error", //Error 404 - Page not found
  },
]

@NgModule({
  declarations: [
    SearchSubcribersComponent,
    PersonalListComponent,
    PersonalEditComponent,
    PersonalViewComponent,
    NewPersonalSidebarComponent, 
    CreateSubcribersComponent
  ],
  imports: [
    CommonModule, 
    RouterModule.forChild(routes),
    NgbModule,
    CoreCommonModule,
    UserModule,
    OrganizationsModule,
    FormsModule,
    NgbModule,
    NgSelectModule,
    Ng2FlatpickrModule,
    NgxDatatableModule,
    CorePipesModule,
    CoreDirectivesModule,
    CoreSidebarModule,
    ReactiveFormsModule,
    // ModuleNewPersonalSidebar
  ],
  providers: [PersonalEditService, PersonalListService, , PersonalViewService],
})

export class IdentityProviderModule {
  constructor() {};

ngOnInit(): void {};
 }

