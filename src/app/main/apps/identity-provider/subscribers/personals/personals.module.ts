import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { CoreCommonModule } from "@core/common.module";
import { CoreSidebarModule } from "@core/components";
import { CoreDirectivesModule } from "@core/directives/directives";
import { CorePipesModule } from "@core/pipes/pipes.module";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { NgSelectModule } from "@ng-select/ng-select";
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { Ng2FlatpickrModule } from "ng2-flatpickr";
import { PersonalEditComponent } from "./personal-edit/personal-edit.component";
import { PersonalEditService } from "./personal-edit/personal-edit.service";
import { NewPersonalSidebarComponent } from './personal-list/new-personal-sidebar/new-personal-sidebar.component';
import { NewPersonalSidebarModule } from "./personal-list/new-personal-sidebar/new-personal-sidebar.module";
import { PersonalListComponent } from "./personal-list/personal-list.component";
import { PersonalListModule } from "./personal-list/personal-list.module";
import { PersonalListService } from "./personal-list/personal-list.service";
import { PersonalRoutingModule } from "./personal-routing.module";
import { PersonalViewComponent } from "./personal-view/personal-view.component";
import { PersonalViewService } from "./personal-view/personal-view.service";

@NgModule({
  declarations: [
    
    PersonalViewComponent,
    PersonalEditComponent,
  ],
  imports: [
    CommonModule, 
    CoreCommonModule,
    FormsModule,
    NgbModule,
    NgSelectModule,
    Ng2FlatpickrModule,
    NgxDatatableModule,
    CorePipesModule,
    CoreDirectivesModule,
    CoreSidebarModule,
    // PersonalRoutingModule,
    PersonalListModule,
    NewPersonalSidebarModule,
    RouterModule,
    // PersonalRoutingModule
  ],
  exports:[
    
    PersonalViewComponent,
    PersonalEditComponent,
    NewPersonalSidebarComponent
    ],
  providers: [PersonalEditService, PersonalListService,  PersonalViewService],
})
export class PersonalsModule {}