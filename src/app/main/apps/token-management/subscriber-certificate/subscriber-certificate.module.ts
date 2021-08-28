import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NgSelectModule } from "@ng-select/ng-select";
import { FormsModule } from "@angular/forms";
import { NgbCollapseModule, NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { SubscriberCertificateListComponent } from "./subscriber-certificate-list/subscriber-certificate-list.component";
import { SubscriberCertificateViewComponent } from "./subscriber-certificate-view/subscriber-certificate-view.component";
import { SubscriberCertificateEditComponent } from "./subscriber-certificate-edit/subscriber-certificate-edit.component";
import { CoreCommonModule } from "@core/common.module";

@NgModule({
  declarations: [
    SubscriberCertificateListComponent,
    SubscriberCertificateViewComponent,
    SubscriberCertificateEditComponent,
  ],
  imports: [
    CommonModule,
    NgSelectModule,
    NgbCollapseModule,
    FormsModule,
    NgbModule,
    CoreCommonModule,
  ],
  exports: [
    SubscriberCertificateListComponent,
    SubscriberCertificateViewComponent,
    SubscriberCertificateEditComponent,
  ],
})
export class SubscriberCertificateModule {}
