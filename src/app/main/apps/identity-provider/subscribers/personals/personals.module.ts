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
import { PersonalListService } from "./personal-list/personal-list.service";
import { TablePersonalListComponent } from "./personal-list/table-personal-list/table-personal-list.component";
import { PersonalViewComponent } from "./personal-view/personal-view.component";
import { PersonalViewService } from "./personal-view/personal-view.service";

@NgModule({
  declarations: [
    PersonalListComponent,
    PersonalViewComponent,
    PersonalEditComponent,
    TablePersonalListComponent
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
    NewPersonalSidebarModule,
    RouterModule

  ],
  exports:[
    PersonalListComponent,
    PersonalViewComponent,
    PersonalEditComponent,
    NewPersonalSidebarComponent,
    TablePersonalListComponent
    ],
  providers: [PersonalEditService, PersonalListService,  PersonalViewService],
})
export class PersonalsModule {}
