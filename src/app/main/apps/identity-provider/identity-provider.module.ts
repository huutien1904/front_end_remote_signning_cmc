import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { CoreCommonModule } from '@core/common.module';
import { CoreSidebarModule } from '@core/components';
import { CoreDirectivesModule } from '@core/directives/directives';
import { CorePipesModule } from '@core/pipes/pipes.module';
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ProfileModule } from './entity-profiles/entity-profile.module';

import { SearchSubscribersModule } from './search-subscribers/search-subscriber.module';
import { OrganizationsModule } from './subscribers/organizations/organizations.module';
import { UsersModule } from './users/users.module';


/**
 * Routing
 */

const routes: Routes = [
  {
    path: "subscribers-list",
    loadChildren: () =>
      import("./search-subscribers/search-subscriber.module").then(
        (m) => m.SearchSubscribersModule
      ),
  },
  
  {
    path: "subscribers-create",
    loadChildren: () =>
      import("./create-subscribers/create-subscribers.module").then(
        (m) => m.CreateSubscribersModule
      ),
  },
  {
    path: "subscribers",
    loadChildren: () =>
      import("./subscribers/subscribers-routing.module").then(
        (m) => m.SubscribersRoutingModule
      ),
  },{ 
    path : 'profiles',
    loadChildren:()=> import('./entity-profiles/entity-profile-routing.module').then(m => m.ProfileRoutingModule)
  },
  {
    path: "users",
    loadChildren: () =>
      import("./users/users-routing.module").then(
        (m) => m.UsersRoutingModule
      ),
  },
  {
    path: "**",
    redirectTo: "/pages/miscellaneous/error", //Error 404 - Page not found
  },
];

@NgModule({
  declarations: [

  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    CoreCommonModule,
    
    ProfileModule,
    SearchSubscribersModule,
    OrganizationsModule,
    UsersModule,
    FormsModule,
    NgSelectModule,
    NgxDatatableModule.forRoot({
      messages: {
        emptyMessage: 'Kh??ng c?? d??? li???u', // Message to show when array is presented, but contains no values
        totalMessage: 't???ng', // Footer total message
        selectedMessage: 'selected' // Footer selected message
      }
    }),
    CorePipesModule,
    CoreDirectivesModule,
    CoreSidebarModule,
    ReactiveFormsModule, 
  ],
  providers: [ 
  ],
})
export class IdentityProviderModule {
  constructor() {}
  ngOnInit(): void {}
}
