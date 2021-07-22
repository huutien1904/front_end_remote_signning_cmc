import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PersonalEditComponent } from './personal-edit/personal-edit.component';
import { PersonalViewComponent } from './personal-view/personal-view.component';
import { PersonalListComponent } from './personal-list/personal-list.component';



@NgModule({
  declarations: [
    PersonalEditComponent,
    PersonalViewComponent,
    PersonalListComponent
  ],
  imports: [
    CommonModule
  ]
})
export class PersonalsModule { }
