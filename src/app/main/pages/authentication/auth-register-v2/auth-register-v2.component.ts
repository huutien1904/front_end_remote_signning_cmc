import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { first, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { CoreConfigService } from '@core/services/config.service';
import { AuthRegisterV2Service } from './auth-register-v2.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-auth-register-v2',
  templateUrl: './auth-register-v2.component.html',
  styleUrls: ['./auth-register-v2.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AuthRegisterV2Component implements OnInit {
  // Public
  public coreConfig: any;
  public passwordTextType: boolean;
  public registerForm: FormGroup;
  public submitted = false;
  public roles = ['USER'];
  public loading = false;

  // Private
  private _unsubscribeAll: Subject<any>;

  /**
   * Constructor
   *
   * @param {CoreConfigService} _coreConfigService
   * @param {FormBuilder} _formBuilder
   * @param {AuthRegisterV2Service} _registerService
   */
  constructor(
    private _coreConfigService: CoreConfigService,
    private _formBuilder: FormBuilder,
    private _registerService: AuthRegisterV2Service,
    private toastr: ToastrService
  ) {
      this._unsubscribeAll = new Subject();

      // Configure the layout
      this._coreConfigService.config = {
        layout: {
          navbar: {
            hidden: true
          },
          menu: {
            hidden: true
          },
          footer: {
            hidden: true
          },
          customizer: false,
          enableLocalStorage: false
        }
      };
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.registerForm.controls;
  }

  /**
   * Toggle password
   */
  togglePasswordTextType() {
    this.passwordTextType = !this.passwordTextType;
  }

  /**
   * On Submit
   */
  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.registerForm.invalid) {
      return;
    }
    this.loading = true;
    const request = JSON.stringify({
      username: this.f.username.value,
      password: this.f.password.value,
      email: this.f.email.value,
      role: this.f.role.value
    })
    this._registerService
      .registerReq(request)
      .pipe(first())
      .subscribe(
        (response: any) => {
          console.log(response);
          if ((response.result = true)) {
            this.toastr.success('👋 Bạn đã đăng kí tài khoản mới', 'Thành công', {
              positionClass: 'toast-top-center',
              toastClass: 'toast ngx-toastr',
              closeButton: true
            });
            this.submitted = false;
            this.registerForm.reset();
            this.loading = false;
          }
        },
        error => {
          this.loading = false;
        }
      )
  }

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    this.registerForm = this._formBuilder.group(
      {
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confPassword: ['', Validators.required],
      role: ['', Validators.required],
      agree: [false, Validators.requiredTrue]
     },
     {
      validator: MustMatch('password', 'confPassword')
      }
    );

    // Subscribe to config changes
    this._coreConfigService.config.pipe(takeUntil(this._unsubscribeAll)).subscribe(config => {
      this.coreConfig = config;
    });
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
