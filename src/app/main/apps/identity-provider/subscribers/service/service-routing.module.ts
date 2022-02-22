import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ServiceListComponent } from './service-list/service-list.component';


const routes: Routes = [
  {
    path: "service-list",
    component: ServiceListComponent,
  },
];
@NgModule({
  declarations: [],
  imports: [
    CommonModule, RouterModule.forChild(routes)
  ]
})
export class ServiceRoutingModule { }
