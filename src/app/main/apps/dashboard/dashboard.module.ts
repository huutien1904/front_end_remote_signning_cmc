import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreCommonModule } from '@core/common.module';
import { CardSnippetModule } from '@core/components/card-snippet/card-snippet.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';
//import { ChartsModule } from 'ng2-charts';
import { DashboardComponent } from './dashboard.component';
import { RouterModule, Routes } from '@angular/router';
import { NgApexchartsModule } from 'ng-apexcharts';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    
  },
  {
    path: "**",
    redirectTo: "/pages/miscellaneous/error", //Error 404 - Page not found
  },
];

@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    ContentHeaderModule,
    CardSnippetModule,
    //ChartsModule,
    CoreCommonModule,
    NgbModule,
    RouterModule.forChild(routes),
    NgApexchartsModule
  ]
})
export class DashboardModule { }
