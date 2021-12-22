import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from './profile/profile.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CoreCommonModule } from '@core/common.module';
import { NgbNavConfig, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { CoreDirectivesModule } from '@core/directives/directives';
import { CoreSidebarModule } from '@core/components';
import { CorePipesModule } from '@core/pipes/pipes.module';

/**
 * Routing
 */

@NgModule({
  declarations: [
    ProfileComponent
  ],
  imports: [
    CoreCommonModule,
    CommonModule, 
    NgbNavModule,
    CoreDirectivesModule,
    NgbModule,
    CorePipesModule,
    CoreSidebarModule
  ],
  exports: [
    ProfileComponent
  ],
})
export class UsersModule { }
