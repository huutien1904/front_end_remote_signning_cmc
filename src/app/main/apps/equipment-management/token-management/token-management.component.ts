import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import {  FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: 'app-token-management',
  templateUrl: './token-management.component.html',
  styleUrls: ['./token-management.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TokenManagementComponent implements OnInit {
  public formListToken: FormGroup;


  onSubmit() {
    console.log(this.fb.control);
  }

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.formListToken = this.fb.group({
      tokenName: ["", Validators.required]
    })
  }

}
