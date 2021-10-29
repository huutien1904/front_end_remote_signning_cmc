import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CoreDirectivesModule } from '@core/directives/directives';
import { CorePipesModule } from '@core/pipes/pipes.module';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [CommonModule, FlexLayoutModule, FormsModule, ReactiveFormsModule, CoreDirectivesModule,HttpClientModule, CorePipesModule],
  exports: [CommonModule, FlexLayoutModule, FormsModule, ReactiveFormsModule, CoreDirectivesModule, CorePipesModule]
})
export class CoreCommonModule {}
