import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-new-service-sidebar',
  templateUrl: './new-service-sidebar.component.html',
  styleUrls: ['./new-service-sidebar.component.scss'],
})
export class NewServiceSidebarComponent implements OnInit {
  public newService;
  public image = '';
  public submitted = false;
  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,) {}

  ngOnInit(): void {
    this.newService = this.fb.group(
      {
        username: [null, Validators.required],
        password: [null, Validators.required],
        rePassword: [null, Validators.required],
        email: ['', [Validators.required, Validators.email]],
        photo: [null, Validators.required],
        serviceName: [null, Validators.required],
        typeDevice: [null, Validators.required],
        domainName: [null, Validators.required],
        organizationName: [null, Validators.required],
      },
      {
        validator: MustMatch('password', 'rePassword'),
      }
    );
  }
  get f() {
    return this.newService.controls;
  }

  inputImage(event) {
    if (typeof FileReader !== 'undefined') {
      const reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (e: any) => {
        this.image = e.target.result;
        console.log(this.image);
        console.log(this.image.split(',')[1]);
        this.newService.patchValue({
          photo: this.image.split(',')[1],
        });
      };
    }
  }
  onSubmit(){}
  toggleSidebar() {
    this.modalService.dismissAll();
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
