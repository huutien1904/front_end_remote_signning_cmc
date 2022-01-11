import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { takeUntil, map } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { HsmService } from '../../hsm-management/hsm.service';
import { TokenService } from '../token.service';

@Component({
  selector: 'app-token-view',
  templateUrl: './token-view.component.html',
  styleUrls: ['./token-view.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TokenViewComponent implements OnInit {
  [x: string]: any;
  // public 
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

  // end public
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
        tokenId : [null, Validators.required],
        slotNumber: [null, Validators.required],
        tokenName: [null, Validators.required],
        tokenPassword: ['', Validators.required],
        hsmInformationId: ["", Validators.required],
        hsmName:["", Validators.required],
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
            name: 'Chi tiết',
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
      this.tokenForm.controls.tokenId.patchValue(data.tokenId);
      this.tokenForm.controls.hsmInformationId.patchValue(data.hsmName);
      this.tokenForm.controls.tokenPassword.patchValue(data.tokenPassword);
      this.tokenForm.controls.hsmName.patchValue(data.hsmName);
      this.tokenForm.controls.hsmInformationId.patchValue(data.hsmId);
      this.tokenForm.controls.tokenId.patchValue(this.lastValue);
      console.log(this.tokenForm.value)
      this.HSMname = data.hsmName
      // const hsmSelected =  this.hsmList.filter((item) =>{
      //   return token.data.hsmId == item.hsmId
      // })
      // console.log(hsmSelected)
      // this.hsmList = hsmSelected
      
    });
  }

  // function
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

  exit() {
    this.router.navigateByUrl("/apps/equipment-management/token/token-list")
  }
  get f() {
    return this.tokenForm.controls;
  }
  

}
