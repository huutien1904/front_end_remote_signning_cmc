import { Component, OnInit, ViewEncapsulation, Input, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PersonalsService } from '../personals.service';
import { Hsm, Token } from 'app/main/models/Equipment'
import { map, takeUntil } from "rxjs/operators";
import {  Subject } from "rxjs";
import { ToastrService } from 'ngx-toastr';
import { HsmlistService } from 'app/main/apps/equipment-management/hsm-management/hsmlist.service';
import { DomSanitizer } from '@angular/platform-browser';

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
  public lengthSelect: any[] = [];
  public fileUrl;
  public fileName;

  //form data
  public cryptoSelect: any[] = [ 'RSA', 'ECDSA'];
  public rsaKeyLength: any[] = ['1024', '1536', '2048', '3072', '4096', '6144', '8192'];
  public ecdsaKeyLength: any[] = ['brainpoolIP160r1', 'brainpoolIP160t1', 'brainpoolIP192r1', 'brainpoolIP192t1',
  'brainpoolIP224r1', 'brainpoolIP224t1', 'brainpoolIP256r1', 'brainpoolIP256t1', 'brainpoolIP384r1', 'brainpoolIP384t1', 'brainpoolIP521r1', 'brainpoolIP521t1']
  public tokenList: Token[];
  public hsmList: Hsm[];

  @Input() personal: any;
  @ViewChild('modalLink') modalLink;

  get f() {
    return this.newRequestForm.controls;
  }
  constructor(
    private fb: FormBuilder,
    private modal: NgbModal,
    private _personalsService: PersonalsService,
    private   toastr: ToastrService,
    private _hsmService: HsmlistService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    this.newRequestForm = this.fb.group(
      {
        cryptoSystem: [null, Validators.required],
        keypairLength: [{value:null, disabled : true}, Validators.required],
        alias: [null, Validators.required],
        tokenId: [{value:null, disabled : true}, Validators.required],
        templateKeyId: ['keypairtemplate_00001'],
        subscriberId: [this.personal.subscriberId],
        hsmInformationId: [null, Validators.required]
      },
      {
        validators: this.usedAlias('alias')
      }
    )
    this.getHsmList();
  }

  toggleSidebar(){
    this.modal.dismissAll();
  }

  downloadSidebar(res){
    this.modal.open(this.modalLink);
    const data = res.data.certificateRequest;
    const blob = new Blob([data], { type: 'application/octet-stream' });
    this.fileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      window.URL.createObjectURL(blob)
    );
    this.fileName = res.data.certificateRequestId + '.csr';
  }
  changeCrypto(event) {
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

  changeHsm() {
    this.newRequestForm.patchValue({
      tokenId: null
    })
    this.newRequestForm.get('tokenId').enable();
    this._hsmService.getHsmDetail(this.f.hsmInformationId.value)
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

  onSubmit() {
    this.submitted = true;
    if (this.newRequestForm.invalid) {
      return;
    }
    const newRequest = JSON.stringify(this.newRequestForm.value);
    this._personalsService.submitForm(newRequest).subscribe((res: any) => {
      console.log(res);
      if ((res.result = true)) {
        this.toggleSidebar();
        this.toastr.success('👋 Bạn đã tạo yêu cầu chứng thực mới', 'Thành công', {
          positionClass: 'toast-top-center',
          toastClass: 'toast ngx-toastr',
          closeButton: true
        });
        this.downloadSidebar(res);
      }
    });
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

  usedAlias(alias: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[alias];
      if(control.errors)
        return;
      this._personalsService.checkAlias(control.value).subscribe((res: any) => {
        console.log(res);
        let check: boolean = res.data;
        if (check == true) {
          control.setErrors({ used: true });
        } else {
          control.setErrors(null);
        }
      });
    };
  }
}

