import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Hsm } from 'app/main/models/Equipment';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { HsmService } from '../../hsm-management/hsm.service';
import { TokenService } from '../token.service';

@Component({
  selector: 'app-token-create',
  templateUrl: './token-create.component.html',
  styleUrls: ['./token-create.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TokenCreateComponent implements OnInit {

  private _unsubscribeAll = new Subject();
  public tokenForm: FormGroup;
  public contentHeader: object;
  public submitted = false;
  public hsmList: any[];
  public slotOption: any[] = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']
  public lockQuantity:any[] = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']
  public body = {
    "page" : null,
    "size" : 4,
    "sort" : ["hsmId,asc"],
    "contains" : "",
    "fromDate" : "",
    "toDate" : ""
  }

  get f() {
    return this.tokenForm.controls;
  }

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private _tokenService: TokenService,
    private _hsmService: HsmService,
    private   toastr: ToastrService
  ) { }

  ngOnInit() {
    this.tokenForm = this.formBuilder.group(
      {
        slotNumber: [null, Validators.required],
        tokenName: [null, Validators.required],
        tokenPassword: ['', Validators.required],
        confPassword: ['', Validators.required],
        hsmInformationId: [null, Validators.required],
        lockQuantity: [null, Validators.required],
      },
      {
        validator: MustMatch('tokenPassword', 'confPassword')
      }
    );
    this.getHsmList();
    this.contentHeader = {
      headerTitle: 'Tạo Slot',
      actionButton: true,
      breadcrumb: {
        type: 'chevron',
        links: [
          {
            name: 'Danh sách Slot',
            isLink: true,
            link: '/apps/equipment-management/token/token-list'

          },
          {
            name: 'Tạo Slot',
            isLink: false,
          }
        ]
      }
    };
  }
  getHsmList() {
    console.log("check")
    this._hsmService.getListHsm(this.body)
      .pipe(
        map(response => {
          console.log(response)
          const data = response.data.data.map(hsmId => ({
            ...hsmId
          }))
          return data;
        }),
        takeUntil(this._unsubscribeAll)
      )
      .subscribe(response => {
        console.log(response)
        this.hsmList = response;
      });

  }
  onSubmit() {
    console.log("create")
    this.submitted = true;
    // stop here if form is invalid
    // if (this.tokenForm.invalid) {
    //   return;
    // }
    console.log(this.tokenForm.value);
    const newRequest = JSON.stringify({
      slotNumber: this.f.slotNumber.value,
      tokenName: this.f.tokenName.value,
      tokenPassword: this.f.tokenPassword.value,
      hsmId: this.f.hsmInformationId.value
    });
    console.log(newRequest)
    this._tokenService.createToken(newRequest)
    .subscribe((res) => {
      console.log(res);
      if ((res.result = true)) {
        this.toastr.success('👋 Bạn đã tạo TOKEN mới', 'Thành công', {
          positionClass: 'toast-top-center',
          toastClass: 'toast ngx-toastr',
          closeButton: true
        });
        this.submitted = false;
        this.router.navigate(['/apps/equipment-management/token/token-list']);
        this.tokenForm.reset();
      }
    })
  }

  exit() {
    this.router.navigateByUrl("/apps/equipment-management/token/token-list")
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
