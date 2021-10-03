import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { CoreCommonModule } from "@core/common.module";
import { NgbCollapseModule, NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { NgSelectModule } from "@ng-select/ng-select";
import { KeypairEditComponent } from "./keypair-edit/keypair-edit.component";
import { KeypairListComponent } from "./keypair-list/keypair-list.component";
import { KeypairViewComponent } from "./keypair-view/keypair-view.component";
import { KeypairCreateComponent } from './keypair-create/keypair-create.component';


@NgModule({
  declarations: [
    KeypairListComponent,
    KeypairViewComponent,
    KeypairEditComponent,
    KeypairCreateComponent,
  ],
  imports: [CommonModule, NgSelectModule, NgbCollapseModule, FormsModule,CoreCommonModule, NgbModule],
  exports: [KeypairListComponent, KeypairViewComponent, KeypairEditComponent],
})
export class KeypairModule {}
