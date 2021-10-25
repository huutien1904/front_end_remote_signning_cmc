import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouterModule, Routes } from "@angular/router";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

import "hammerjs";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { TranslateModule } from "@ngx-translate/core";
import { ToastrModule } from "ngx-toastr"; // For auth after login toast
import { FakeDbService } from "@fake-db/fake-db.service";

import { CoreModule } from "@core/core.module";
import { CoreCommonModule } from "@core/common.module";
import { CoreSidebarModule, CoreThemeCustomizerModule } from "@core/components";

import { coreConfig } from "app/app-config";

import { AppComponent } from "app/app.component";
import { LayoutModule } from "app/layout/layout.module";
import {
  ErrorInterceptor,
  JwtInterceptor,
} from "app/auth/helpers"; // used to create fake backend
import { AuthGuard } from 'app/auth/helpers/auth.guards';

import { HttpClientInMemoryWebApiModule } from "angular-in-memory-web-api";
import { SpinnerComponent } from './main/loading/spinner/spinner.component';
import { LoadingService } from "./main/loading/loading.service";
import { LoadingInterceptor } from "./main/loading/loading.interceptor";

const appRoutes: Routes = [
  {
    path: "pages",
    loadChildren: () =>
      import("./main/pages/pages.module").then((m) => m.PagesModule),
  },
  {
    path: "apps",
    loadChildren: () =>
      import("./main/apps/apps.module").then((m) => m.AppsModule),
      canActivate: [AuthGuard]
  },
  {
    path: "",
    redirectTo: "/apps/dashboard",
    pathMatch: "full",
  },
  {
    path: "**",
    redirectTo: "/pages/miscellaneous/error", //Error 404 - Page not found
  },
];

@NgModule({
  declarations: [
    AppComponent,
    SpinnerComponent,
  ],
  entryComponents: [ SpinnerComponent ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    
    HttpClientInMemoryWebApiModule.forRoot(FakeDbService, {
      delay: 0,
      passThruUnknownUrl: true,
    }),
    RouterModule.forRoot(appRoutes, {
      scrollPositionRestoration: "enabled", // Add options right here
      relativeLinkResolution: "legacy",
    }),
    TranslateModule.forRoot(),

    //NgBootstrap
    NgbModule,
    ToastrModule.forRoot(),

    // Core modules
    CoreModule.forRoot(coreConfig),
    CoreCommonModule,
    CoreSidebarModule,
    CoreThemeCustomizerModule,

    // App modules
    LayoutModule,
    MatProgressSpinnerModule
  ],
  providers: [
    
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    LoadingService,
      // {
      //   provide: HTTP_INTERCEPTORS,
      //   useClass: LoadingInterceptor,
      //   multi: true
      // }
  ],
  bootstrap: [AppComponent],
  
})
export class AppModule {}
