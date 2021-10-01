import { NgModule } from '@angular/core';

import { FeatherIconDirective } from '@core/directives/core-feather-icons/core-feather-icons';
import { RippleEffectDirective } from '@core/directives/core-ripple-effect/core-ripple-effect.directive';
import { InputTrimDirective } from './core-trim-input/input-trim-directive';

@NgModule({
  declarations: [RippleEffectDirective, FeatherIconDirective, InputTrimDirective ],
  exports: [RippleEffectDirective, FeatherIconDirective, InputTrimDirective]
})
export class CoreDirectivesModule {}
