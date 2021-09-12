import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidationErrors, AbstractControl } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PersonalsService } from '../personals.service';
import { Token } from 'app/main/models/Token'
import { TokenlistService } from 'app/main/apps/equipment-management/token-management/tokenlist.service';
import { map, takeUntil } from "rxjs/operators";
import {  Subject } from "rxjs";
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-sidebar-personals',
  templateUrl: './sidebar-personals.component.html',
  styleUrls: ['./sidebar-personals.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SidebarPersonalsComponent implements OnInit {
  private _unsubscribeAll = new Subject();
  public newRequestForm: FormGroup;
  public submitted = false;

  //form data
  public cryptoSelect: any[] = [ 'RSA', 'ECDSA'];
  public rsaKeyLength: any[] = ['1024', '1536', '2048', '3072', '4096', '6144', '8192'];
  public ecdsaKeyLength: any[] = ['brainpoolIP160r1', 'brainpoolIP160t1', 'brainpoolIP192r1', 'brainpoolIP192t1',
  'brainpoolIP224r1', 'brainpoolIP224t1', 'brainpoolIP256r1', 'brainpoolIP256t1', 'brainpoolIP384r1', 'brainpoolIP384t1', 'brainpoolIP521r1', 'brainpoolIP521t1']
  public tokenList: Token[];
  public lengthSelect: any[] = [];

  @Input() personal: any;

  get f() {
    return this.newRequestForm.controls;
  }
  constructor(
    private fb: FormBuilder,
    private modal: NgbModal,
    private _personalsService: PersonalsService,
    private _tokenService: TokenlistService,
    private   toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.newRequestForm = this.fb.group({
      cryptoSystem: [null, Validators.required],
      keypairLength: [{value:null, disabled : true}, Validators.required],
      alias: [null, Validators.required],
      tokenId: [null, Validators.required],
      templateKeyId: ['keypairtemplate_00001'],
      subscriberId: [this.personal.subscriberId]
    })
    this.getTokenList();
  }

  toggleSidebar(){
    this.modal.dismissAll();
  }
  changeHsm(event) {
    this.newRequestForm.patchValue({
      keypairLength: null
    })
    this.newRequestForm.get('keypairLength').enable();
    switch (event) {
      case 'RSA':
        this.lengthSelect = this.rsaKeyLength;
        break;
      case 'ECDSA':
        this.lengthSelect = this.ecdsaKeyLength;
        break;
    }
  }

  onSubmit() {
    this.submitted = true;

    if (this.newRequestForm.invalid) {
      return;
    }
    const newRequest = JSON.stringify(this.newRequestForm.value);
    this._personalsService.submitForm(newRequest).subscribe((res: any) => {
      console.log(res);
      if ((res.result = "true")) {
        this.toggleSidebar();
        this.toastr.success('👋 Bạn đã tạo yêu cầu chứng thực mới', 'Thành công', {
          positionClass: 'toast-top-center',
          toastClass: 'toast ngx-toastr',
          closeButton: true
        });
      }
    });
  }

  //Lay danh sach token
  getTokenList() {
    this._tokenService.getToken()
      .pipe(
        map(response => {
          const data = response.data.map(tokenId => ({
            ...tokenId
          }))
          return data;
        }),
        takeUntil(this._unsubscribeAll)
      )
      .subscribe(response => {
        this.tokenList = response;
      });
  }
}
/*
export function UnUsedAlias(alias: AbstractControl, _personalsService: PersonalsService): ValidationErrors|null {
  let check: boolean = _personalsService.checkAlias(alias);
  if(check)
    return null;
  return {use: true}
}
*/
