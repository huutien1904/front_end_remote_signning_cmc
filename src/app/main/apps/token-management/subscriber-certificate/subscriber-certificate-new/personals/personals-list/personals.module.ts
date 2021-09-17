import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PersonalsComponent } from './personals.component';
import { CoreCommonModule } from '@core/common.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { PersonalListService } from 'app/main/apps/identity-provider/subscribers/personals/personal-list/personal-list.service';



@NgModule({
  declarations: [PersonalsComponent],
  imports: [
    CommonModule,
    NgSelectModule,
    CoreCommonModule,
    NgbModule,
  ],
  exports:[PersonalsComponent],
  providers: [
    PersonalListService,
  ],
  })

export class PersonalsModule { }
