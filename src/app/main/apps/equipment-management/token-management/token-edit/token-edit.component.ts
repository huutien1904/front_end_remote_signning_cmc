import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { HsmService } from '../../hsm-management/hsm.service';
import { TokenService } from '../token.service';

@Component({
  selector: 'app-token-edit',
  templateUrl: './token-edit.component.html',
  styleUrls: ['./token-edit.component.scss'],
  encapsulation: ViewEncapsulation.None

})
export class TokenEditComponent implements OnInit {
  public url = this.router.url;
  public lastValue;
  private _unsubscribeAll = new Subject();
  public tokenForm: FormGroup;
  public contentHeader: object;
  public submitted = false;
  public hsmList: any[];
  public slotOption: any[] = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']
  public body = {
    "page" : null,
    "size" : 4,
    "sort" : ["hsmId,asc"],
    "contains" : "",
    "fromDate" : "",
    "toDate" : ""
  }
  public HSMname = ""
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
        hsmInformationId: [{
          
        }, Validators.required],
      },
      
    );
    this.getHsmList();
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

    this._unsubscribeAll = new Subject();
    this.lastValue = this.url.substr(this.url.lastIndexOf('/') + 1);
    this._tokenService.getTokenId(this.lastValue)
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe((token:any) => {
      console.log(token.data);
      const data = token.data ;
      this.tokenForm.controls.slotNumber.patchValue(data.slotNumber);
      this.tokenForm.controls.tokenName.patchValue(data.tokenName);
      this.tokenForm.controls.tokenPassword.patchValue(data.tokenPassword);
      const hsmSelected =  this.hsmList.filter((item) =>{
        return token.data.hsmId == item.hsmId
      })
      console.log(hsmSelected)
      
      
    });
  }
  getHsmList() {
   
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
        this.hsmList = response;
        console.log(this.hsmList);
      });

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

}

