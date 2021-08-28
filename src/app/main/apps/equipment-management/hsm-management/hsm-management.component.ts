import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import {  FormBuilder, FormGroup, Validators } from "@angular/forms";


@Component({
  selector: 'app-hsm-management',
  templateUrl: './hsm-management.component.html',
  styleUrls: ['./hsm-management.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HsmManagementComponent implements OnInit {
  public formListHSM: FormGroup;

  onSubmit() {
    console.log(this.fb.control);
  }

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.formListHSM = this.fb.group({
      hsmName: ["", Validators.required]
    })
  }

}
