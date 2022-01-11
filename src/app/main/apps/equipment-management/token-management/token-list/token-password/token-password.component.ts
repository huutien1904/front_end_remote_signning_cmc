import { Component, OnInit,Input, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { map, takeUntil } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { HsmService } from '../../../hsm-management/hsm.service';
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
  public lastValue;
  public tokenInfo: Token;
  @Input() personal: any;

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
  public body = {
    page: null,
    size: 100,
    sort: ['hsmId,asc'],
    contains: '',
    fromDate: '',
    toDate: '',
  };
  public HSMname = '';

  // end public

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private _tokenService: TokenService,
    private _hsmService: HsmService,
    private toastr: ToastrService,
    private modal: NgbModal,
  ) {
    this._unsubscribeAll = new Subject();
    this.lastValue = this.url.substr(this.url.lastIndexOf('/') + 1);
    this.tokenForm = this.fb.group({
      slotNumber: [null, Validators.required],
      tokenName: [null, Validators.required],
      tokenPassword: [null, Validators.required],
      tokenPasswordConfirm: [null, Validators.required],
      tokenNewPassword: [null, Validators.required],
      tokenNewPasswordConfirm: [null, Validators.required],
      hsmId: [null, Validators.required],
      tokenId: [null, Validators.required],
    });
    // this.asyncValidators()
  }

  async ngOnInit() {
    console.log(this.personal)
    console.log(this.tokenInfo);
    this.tokenForm.patchValue({
      tokenName: this.personal.tokenName,
      slotNumber: this.personal.slotNumber,
      tokenId: this.personal.tokenId,
      hsmName:this.personal.hsmName,
      //  tokenPassword: this.tokenInfo.tokenName,
    });
    console.log(this.tokenForm.value);

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
        slotNumber: this.f.slotNumber.value,
        tokenName: this.f.tokenName.value,
        tokenPassword: this.f.tokenPassword.value,
        hsmId: this.f.hsmId.value,
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
            .updateTokenId(this.lastValue, newRequest)
            .pipe(takeUntil(this._unsubscribeAll))
            .toPromise()
            .then((res) => {
              if (res.result == false) {
                throw new Error(res.message);
              }
              return res;
            })
            .catch(function (error) {
              Swal.showValidationMessage('Mã lỗi:  ' + error + '');
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
            text: 'TOKEN đã được cập nhật.',
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