import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import { NgSelectModule } from "@ng-select/ng-select";
import { FormsModule } from "@angular/forms";
import { NgbCollapseModule } from "@ng-bootstrap/ng-bootstrap";
import { KeypairListComponent } from "./keypair-list/keypair-list.component";
import { KeypairViewComponent } from "./keypair-view/keypair-view.component";
import { KeypairEditComponent } from "./keypair-edit/keypair-edit.component";


@NgModule({
  declarations: [
    KeypairListComponent,
    KeypairViewComponent,
    KeypairEditComponent,
  ],
  imports: [CommonModule, NgSelectModule, NgbCollapseModule, FormsModule],
  exports: [KeypairListComponent, KeypairViewComponent, KeypairEditComponent],
})
export class KeypairModule {}
