import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { PersonalsModule } from './personals/personals.module';
import { SubscribersRoutingModule } from './subscribers-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { OrganizationsModule } from './organizations/organizations.module';
import { ServiceModule } from './service/service.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule, 
    PersonalsModule,
    OrganizationsModule,
    SubscribersRoutingModule,
    ServiceModule
  ],
  providers: [
  ]
  // exports:[PersonalsModule]
})
export class SubscribersModule { }