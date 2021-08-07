import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KeypairTemplateComponent } from './keypair-template.component';
import { RouterModule, Routes } from '@angular/router';


const routes: Routes = [
  {
    path: "",
    component: KeypairTemplateComponent,
    data: { animation: "KeypairTemplateComponent" },
  },
  {
    path: "**",
    redirectTo: "/pages/miscellaneous/error", //Error 404 - Page not found
  },
]
@NgModule({
  declarations: [KeypairTemplateComponent],
  imports: [
    CommonModule, RouterModule.forChild(routes),
  ]
})
export class KeypairTemplateModule { }
