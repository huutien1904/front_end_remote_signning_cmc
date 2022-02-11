import { Component, OnInit,Input, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { map, takeUntil } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { TokenService } from '../../token.service';
import { Hsm, Token } from 'app/main/models/Equipment';

@Component({
  selector: 'app-token-password',
  templateUrl: './token-password.component.html',
  styleUrls: ['./token-password.component.scss'],
})
export class TokenPasswordComponent implements OnInit {
  private _unsubscribeAll = new Subject();
  public tokenForm: FormGroup;
  // public
  public url = this.router.url;
  @Input() tokenDetail: any;

  public contentHeader: object;
  public submitted = false;
  public hsmList: Hsm[];
  public slotOption: any[] = [
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '10',
  ];
  public lockQuantity: any[] = [
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '10',
  ];
  
  public HSMname = '';

  // end public

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private _tokenService: TokenService,
    private modal: NgbModal,
  ) {
    this._unsubscribeAll = new Subject();
    this.tokenForm = this.fb.group({
      tokenOldPassword: [null, Validators.required],
      tokenNewPassword: [null, Validators.required],
      tokenRenewPassword: [null, Validators.required],
      
    },
    {
      validator: MustMatch('tokenNewPassword', 'tokenRenewPassword'),
    },
    );
    // this.asyncValidators()
  }

  async ngOnInit() {
    console.log(this.tokenDetail.tokenId)
    // this.tokenForm.patchValue({
    //   tokenName: this.tokenDetail.tokenName,
    //   slotNumber: this.tokenDetail.slotNumber,
    //   tokenId: this.tokenDetail.tokenId,
    //   hsmName:this.tokenDetail.hsmName,
    //   //  tokenPassword: this.tokenInfo.tokenName,
    // });
    // console.log(this.tokenForm.value);

  }

  get f() {
    return this.tokenForm.controls;
  }
  onSubmit() {
    console.log('check');
    this.submitted = true;
    // stop here if form is invalid
    //console.log(this.tokenForm.invalid)
    // if (this.tokenForm.invalid) {
    //   return;
    // }
    if (this.tokenForm.valid) {
      console.log(this.tokenForm.value);
      const newRequest = JSON.stringify({
        tokenInitOld: this.f.tokenOldPassword.value,
        tokenInitNew: this.f.tokenNewPassword.value,
      });
      console.log(newRequest);
      Swal.fire({
        title: 'Bạn có chắc muốn cập nhật?',
        text: 'Bạn sẽ không thể hoàn tác điều này!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#7367F0',
        preConfirm: async () => {
          return await this._tokenService
            .updateTokenPassword(this.tokenDetail.tokenId, newRequest)
            .pipe(takeUntil(this._unsubscribeAll))
            .toPromise()
            .then((res) => {
              if (res.result == false) {
                throw new Error(res.message);
              }
              return res;
            })
            .catch(function (error) {
              Swal.showValidationMessage('Mật khẩu không chính xác');
            });
        },
        cancelButtonColor: '#E42728',
        cancelButtonText: 'Thoát',
        confirmButtonText: 'Đúng, tôi muốn cập nhật!',
        customClass: {
          confirmButton: 'btn btn-primary',
          cancelButton: 'btn btn-danger ml-1',
        },
        allowOutsideClick: () => {
          return !Swal.isLoading();
        },
      }).then(function (result) {
        if (result.value) {
          Swal.fire({
            icon: 'success',
            title: 'Thành công!',
            text: 'TOKEN đổi mật khẩu so thành công.',
            customClass: {
              confirmButton: 'btn btn-success',
            },
          });
        }
      });
    }
  }

  exit() {
    this.modal.dismissAll();
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