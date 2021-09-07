import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PersonalsComponent } from './personals.component';
import { NgbCollapseModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { CoreCommonModule } from '@core/common.module';
import { SidebarPersonalsComponent } from './sidebar-personals/sidebar-personals.component';
import { PersonalListService } from 'app/main/apps/identity-provider/subscribers/personals/personal-list/personal-list.service';



@NgModule({
  declarations: [PersonalsComponent, SidebarPersonalsComponent],
  imports: [
    CommonModule,
    NgbCollapseModule,
    NgbModule,
    NgSelectModule,
    CoreCommonModule
  ],
  exports: [PersonalsComponent],
  providers: [ PersonalListService],
})
export class PersonalsModule { }
