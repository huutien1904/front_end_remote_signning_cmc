import { Component, OnInit, OnDestroy, ViewEncapsulation, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { cloneDeep } from 'lodash';

import { UserEditService } from './user-edit.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class UserEditComponent implements OnInit, OnDestroy {
  // Public
  public url = this.router.url;
  public urlLastValue;
  public rows;
  public currentRow;
  public tempRow;
  public avatarImage: string;

  //param
  public UDForm = {
    username: '',
    email:'',
    password:'',
    firstName:'',
    lastName:'',
    phoneNo:'',
    role:'',
    createdAt : '',
    confPassword:'',
  };
  roles = [ 'ADMIN', 'SUPERADMIN', 'OPERATOR',   
  
  'USER-PERSONAL', 'USER-ORGANIZATION', 'USER-SERVICE', 'USER-DEVICE' ]
  public ReactiveUserDetailsForm: FormGroup;
  public ReactiveUDFormSubmitted = false;

  // Private
  private _unsubscribeAll: Subject<any>;

  /**
   * Constructor
   *
   * @param {Router} router
   * @param {UserEditService} _userEditService
   */
  constructor(private router: Router, private _userEditService: UserEditService, private formBuilder: FormBuilder) {
    this._unsubscribeAll = new Subject();
    this.urlLastValue = this.url.substr(this.url.lastIndexOf('/') + 1);
  }

  // Public Methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Submit
   *
   * @param form
   */
   get ReactiveUDForm() {
    return this.ReactiveUserDetailsForm.controls;
  }
   ReactiveUDFormOnSubmit() {
    this.ReactiveUDFormSubmitted = true;

    // stop here if form is invalid
    if (this.ReactiveUserDetailsForm.invalid) {
      return;
    }
    this.UDForm = this.currentRow;
    alert('Đã lưu thay đổi:\nTên tài khoản: ' + this.UDForm.username + '\nHọ và tên: ' + this.UDForm.lastName + this.UDForm.firstName + '\nSố điện thoại: ' + this.UDForm.phoneNo + '\nEmail: ' + this.UDForm.email + '\nPassword: ' + this.UDForm.password + '\nVai trò: ' + this.UDForm.role + '\nNgày đăng kí: ' + this.UDForm.createdAt);

  }

  cancel() {
    this.router.navigateByUrl('/apps/ip/users/user/user-view/' + this.urlLastValue);
  }
  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------
  /**
   * On init
   */
  ngOnInit(): void {
    this._userEditService.onUserEditChanged.pipe(takeUntil(this._unsubscribeAll)).subscribe(response => {
      this.rows = response;
      this.rows.map(row => {
        if (row.id == this.urlLastValue) {
          this.currentRow = row;
          this.avatarImage = this.currentRow.avatar;
          this.tempRow = cloneDeep(row);
        }
      });
    });
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

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
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
