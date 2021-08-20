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
  
  // {
  //   path: 'subscribers-search',
  //   component : SearchSubcribersComponent,
  //   canActivate : [AuthGuard], 
  //   // resolve: {
  //   //   uls: DashboardService
  //   // },
  //   data: {roles: [Role.SuperAdmin], animation: "" },
  // },
  {
    path: 'users',
    loadChildren: () => import('./users/users.module').then(m => m.UsersModule),
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
    
  ],
  imports: [
    CommonModule, 
    RouterModule.forChild(routes),
    NgbModule,
    CoreCommonModule,
    UserModule,
    PersonalsModule,
    OrganizationsModule
  ]
})
export class IdentityProviderModule {
  constructor() {};

ngOnInit(): void {};
 }

