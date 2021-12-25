import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TokenService } from '../token-management/token.service';
import { Hsm } from 'app/main/models/Equipment'
import { HsmListService } from '../hsm-management/hsm-list.service';
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
  public slotOption: any[] = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']


  get f() {
    return this.tokenForm.controls;
  }

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private _tokenService: TokenService,
    private _hsmService: HsmListService,
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
      headerTitle: 'Tạo Token',
      actionButton: true,
      breadcrumb: {
        type: 'chevron',
        links: [
          {
            name: 'Quản lý thiết bị',
            isLink: false,
          },
          {
            name: 'Tạo Token',
            isLink: true,
            link: '/apps/equipment-management/new-token'
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
  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.tokenForm.invalid) {
      return;
    }

    const newRequest = JSON.stringify({
      slotNumber: this.f.slotNumber.value,
      tokenName: this.f.tokenName.value,
      tokenPassword: this.f.tokenPassword.value,
      hsmInformationId: this.f.hsmInformationId.value
    });

  }

  exit() {
    this.router.navigateByUrl("/apps/equipment-management/search")
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

