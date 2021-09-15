import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TokenlistService } from '../token-management/tokenlist.service';
import { Hsm } from 'app/main/models/Equipment'
import { HsmlistService } from '../hsm-management/hsmlist.service';
import {  Subject } from "rxjs";
import { map, takeUntil } from "rxjs/operators";
@Component({
  selector: 'app-new-token',
  templateUrl: './new-token.component.html',
  styleUrls: ['./new-token.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NewTokenComponent implements OnInit {
  private _unsubscribeAll = new Subject();
  public tokenForm: FormGroup;
  public contentHeader: object;
  public submitted = false;
  public hsmList: Hsm[];


  get f() {
    return this.tokenForm.controls;
  }
  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.tokenForm.invalid) {
      return;
    }

    const newRequest = JSON.stringify(this.tokenForm.value);
    this._tokenService.submitForm(newRequest).subscribe((res: any) => {
      console.log(res);
      if ((res.result = "true")) {
        this.toastr.success('👋 Bạn đã tạo token mới', 'Thành công', {
          positionClass: 'toast-top-center',
          toastClass: 'toast ngx-toastr',
          closeButton: true
        });
        this.submitted = false;
        this.tokenForm.reset();
      }
    });
  }

  exit() {
    this.router.navigateByUrl("/apps/equipment-management/search")
  }
  
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private _tokenService: TokenlistService,
    private _hsmService: HsmlistService,
    private   toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.tokenForm = this.formBuilder.group(
      {
        slotNumber: [null, Validators.required],
        tokenName: [null, Validators.required],
        tokenPassword: ['', Validators.required],
        confPassword: ['', Validators.required],
        hsmInformationId: [null, Validators.required],
      },
      {
        validator: MustMatch('tokenPassword', 'confPassword')
      }
    );
    this.getHsmList();
    this.contentHeader = {
      headerTitle: 'Token',
      actionButton: true,
      breadcrumb: {
        type: 'chevron',
        links: [
          {
            name: 'Quản lý thiết bị',
            isLink: true,
            link: '/apps/equipment-management/search'
          },
          {
            name: 'Tạo mới',
            isLink: false
          },
          {
            name: 'Token',
            isLink: false
          }
        ]
      }
    };
  }

  getHsmList() {
    this._hsmService.getAllHsm()
      .pipe(
        map(response => {
          const data = response.data.map(hsmId => ({
            ...hsmId
          }))
          return data;
        }),
        takeUntil(this._unsubscribeAll)
      )
      .subscribe(response => {
        this.hsmList = response;
      });
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

