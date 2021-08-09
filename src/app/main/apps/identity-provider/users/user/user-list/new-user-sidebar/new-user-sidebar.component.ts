import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-new-user-sidebar',
  templateUrl: './new-user-sidebar.component.html',
  styleUrls: ['./new-user-sidebar.component.scss'],
})
export class NewUserSidebarComponent implements OnInit {
  public ReactiveUserDetailsForm: FormGroup;
  public ReactiveUDFormSubmitted = false;
  public roles = [ 'ADMIN', 'SUPERADMIN', 'OPERATOR',   
  
  'USER-PERSONAL', 'USER-ORGANIZATION', 'USER-SERVICE', 'USER-DEVICE' ];
  public UDForm = {
    username: '',
    email:'',
    password:'',
    firstName:'',
    lastName:'',
    phoneNo:'',
    role:'',
    createdAt : new Date(),
    confPassword:'',
  };

  /**
   *' Constructor
   *
   * @param {NgbModal} modalService
   */
  constructor(
    private formBuilder: FormBuilder,
    private modalService: NgbModal
    ) {}

  get ReactiveUDForm() {
    return this.ReactiveUserDetailsForm.controls;
  }

  toggleSidebar(){
    this.modalService.dismissAll();
  }

  ReactiveUDFormOnSubmit() {
    this.ReactiveUDFormSubmitted = true;

    // stop here if form is invalid
    if (this.ReactiveUserDetailsForm.invalid) {
      return;
    }

    alert('Đăng kí thành công\nThông tin đăng kí:Tên tài khoản: ' + this.UDForm.username + '\nHọ và tên: ' + this.UDForm.lastName + this.UDForm.firstName + '\nSố điện thoại: ' + this.UDForm.phoneNo + '\nEmail: ' + this.UDForm.email + '\nPassword: ' + this.UDForm.password + '\nVai trò: ' + this.UDForm.role + '\nNgày đăng kí: ' + this.UDForm.createdAt);
    this.toggleSidebar(); 
  }

  ngOnInit(): void {
    this.ReactiveUserDetailsForm = this.formBuilder.group(
    {
      username: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confPassword: ['', [Validators.required, Validators.minLength(6)]],
      phoneNo: ['', [Validators.required]],
    },
    {
        validator: MustMatch('password', 'confPassword')
    }
    );
  }
}
  export function MustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];
  
      if (matchingControl.errors && !matchingControl.errors.mustMatch) {
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

