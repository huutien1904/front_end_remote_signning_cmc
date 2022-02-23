import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-new-service-sidebar',
  templateUrl: './new-service-sidebar.component.html',
  styleUrls: ['./new-service-sidebar.component.scss'],
})
export class NewServiceSidebarComponent implements OnInit {
  public newService;
  FormGroup;
  public submitted = false;
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.newService = this.fb.group(
      {
        username: [null, Validators.required],
        password: [null, Validators.required],
        rePassword: [null, Validators.required],
        email: ['', [Validators.required, Validators.email]],
      },
      {
        validator: MustMatch('password', 'rePassword'),
      }
    );
  }
  get f() {
    return this.newService.controls;
  }
}
export function MustMatch(controlName: string, matchingControlName: string) {
  return (formGroup: FormGroup) => {
    const control = formGroup.controls[controlName];
    const matchingControl = formGroup.controls[matchingControlName];
    if (matchingControl?.errors && !matchingControl?.errors?.mustMatch) {
      // return if another validator has already found an error on the matchingControl
      return;
    }
    // set error on matchingControl if validation fails
    if (control.value !== matchingControl.value) {
      matchingControl.setErrors({ mustMatch: true });
    } else {
      matchingControl.setErrors(null);
    }
  };
}
