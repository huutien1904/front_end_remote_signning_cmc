import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServiceListComponent } from './service-list/service-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NewServiceSidebarComponent } from './service-list/new-service-sidebar/new-service-sidebar.component';



@NgModule({
  declarations: [
    ServiceListComponent,
    NewServiceSidebarComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    NgbModule,
  ],
  exports: [ServiceListComponent]
})
export class ServiceModule { }
