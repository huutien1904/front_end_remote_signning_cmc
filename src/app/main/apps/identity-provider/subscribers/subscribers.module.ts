import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { PersonalsModule } from './personals/personals.module';
import { SubscribersRoutingModule } from './subscribers-routing.module';
import { LoadingComponent } from './loading/loading.component';
import { LoadingService } from './loading/loading.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { LoadingInterceptor } from './loading/loading.interceptor';


/**
 * Routing
 */
// const routes: Routes = [
//   { 
//     path: 'personals',
//     loadChildren:()=> import('./personals/personals.module').then(m => m.PersonalsModule)
//   },
//   { 
//     path : 'organizations',
//     loadChildren:()=> import('./organizations/organizations.module').then(m => m.OrganizationsModule)
//   },
//   {
//     path: "**",
//     redirectTo: "/pages/miscellaneous/error", //Error 404 - Page not found
//   },
// ]
@NgModule({
  declarations: [
    
  
    LoadingComponent
  ],
  imports: [
    CommonModule, 
    PersonalsModule,
    SubscribersRoutingModule
    // RouterModule.forChild(routes),
  ],
  providers: [
    LoadingService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoadingInterceptor,
      multi: true
    }
  ]
  // exports:[PersonalsModule]
})
export class SubscribersModule { }