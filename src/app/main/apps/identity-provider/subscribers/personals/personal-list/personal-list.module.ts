import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PersonalListComponent } from "./personal-list.component";
import { CoreCommonModule } from "@core/common.module";
import { RouterModule } from "@angular/router";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { NgSelectModule } from "@ng-select/ng-select";

@NgModule({
  imports: [CommonModule, CoreCommonModule, RouterModule, NgbModule,NgSelectModule],
  declarations: [PersonalListComponent, ],
  exports: [PersonalListComponent, ],
})
export class PersonalListModule {}
