import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { HsmService } from '../../hsm-management/hsm.service';
import { TokenService } from '../token.service';
import { Hsm, Token } from 'app/main/models/Equipment';


@Component({
  selector: 'app-token-edit',
  templateUrl: './token-edit.component.html',
  styleUrls: ['./token-edit.component.scss'],
  encapsulation: ViewEncapsulation.None

})
export class TokenEditComponent implements OnInit {
  private _unsubscribeAll = new Subject();
  public tokenForm: FormGroup;
  // public 
  public url = this.router.url;
  public lastValue;
  public tokenInfo:Token;
  
  public contentHeader: object;
  public submitted = false;
  public hsmList: Hsm[];
  public slotOption: any[] = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']
  public body = {
    "page" : null,
    "size" : 100,
    "sort" : ["hsmId,asc"],
    "contains" : "",
    "fromDate" : "",
    "toDate" : ""
  }
  public HSMname = ""

  // end public
  

  
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private _tokenService: TokenService,
    private _hsmService: HsmService,
    private   toastr: ToastrService
  ) { 
    this._unsubscribeAll = new Subject();
    this.lastValue = this.url.substr(this.url.lastIndexOf('/') + 1);
    this.tokenForm = this.fb.group(
      {
        slotNumber: [null, Validators.required],
        tokenName: [null, Validators.required],
        tokenPassword: [null, Validators.required],
        hsmId: [null, Validators.required],
      }
    );
  }

  async ngOnInit() {

    this.hsmList = await this._hsmService.getListHsm(this.body)
    .pipe(takeUntil(this._unsubscribeAll))
    .toPromise().then(res => {
      return res.data.data;
    });
    console.log(this.hsmList);
    this.tokenInfo = await this._tokenService.getTokenId(this.lastValue).pipe(takeUntil(this._unsubscribeAll)).toPromise().then(res=>{
       return res.data;
     });
     this.hsmList.forEach(hsm => {
       console.log(hsm.hsmId);
       if(hsm.hsmId==this.tokenInfo.hsmId){
        this.tokenForm.get("hsmId").setValue(hsm);
       }
     })
     console.log(this.tokenInfo);
     this.tokenForm.patchValue({
       tokenName: this.tokenInfo.tokenName,
       slotNumber : this.tokenInfo.slotNumber
     });

    
    this.contentHeader = {
      headerTitle: 'Tạo Token',
      actionButton: true,
      breadcrumb: {
        type: 'chevron',
        links: [
          {
            name: 'Danh sách TOKEN',
            isLink: true,
            link: '/apps/equipment-management/token/token-list'

          },
          {
            name: 'Sửa Token',
            isLink: false,
          }
        ]
      }
    };

  }

  get f() {
    return this.tokenForm.controls;
  }
  onSubmit() {
    console.log("check")
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
    // console.log(newRequest)
    // this._tokenService.createToken(newRequest)
    // .subscribe((res) => {
    //   console.log(res);
    //   if ((res.result = true)) {
    //     this.toastr.success('👋 Bạn đã tạo TOKEN mới', 'Thành công', {
    //       positionClass: 'toast-top-center',
    //       toastClass: 'toast ngx-toastr',
    //       closeButton: true
    //     });
    //     this.submitted = false;
    //     this.router.navigate(['/apps/equipment-management/token/token-list']);
    //     this.tokenForm.reset();
    //   }
    // })

    Swal.fire({
      title: 'Bạn có chắc muốn cập nhật?',
      text: "Bạn sẽ không thể hoàn tác điều này!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#7367F0',
      preConfirm:   async () => {
      return await this._tokenService
      .updateTokenId(this.lastValue,newRequest )
      .pipe(takeUntil(this._unsubscribeAll))
      .toPromise().then(res=>{
        if(res.result==false){
          throw new Error(res.message);
        }
        return res;
      }).catch(
        function (error) {
          Swal.showValidationMessage('Mã lỗi:  ' + error + '');
        }
      );
     },
      cancelButtonColor: '#E42728',
      cancelButtonText: "Thoát",
      confirmButtonText: 'Đúng, tôi muốn cập nhật!',
      customClass: {
        confirmButton: 'btn btn-primary',
        cancelButton: 'btn btn-danger ml-1'
      },
      allowOutsideClick:  () => {
        return !Swal.isLoading();
      }
    }).then(function (result) {
      if (result.value) {
        Swal.fire({
          icon: 'success',
          title: 'Thành công!',
          text: 'TOKEN đã được cập nhật.',
          customClass: {
            confirmButton: 'btn btn-success'
          }
        });
      }
    }
    
    );
  }

  exit() {
    this.router.navigateByUrl("/apps/equipment-management/search")
  }

  // end function
}

function asyncValidators(arg0: { slotNumber: ((control: import("@angular/forms").AbstractControl) => import("@angular/forms").ValidationErrors)[]; tokenName: ((control: import("@angular/forms").AbstractControl) => import("@angular/forms").ValidationErrors)[]; tokenPassword: ((control: import("@angular/forms").AbstractControl) => import("@angular/forms").ValidationErrors)[]; hsmId: ((control: import("@angular/forms").AbstractControl) => import("@angular/forms").ValidationErrors)[]; }, asyncValidators: any): FormGroup {
  throw new Error('Function not implemented.');
}

