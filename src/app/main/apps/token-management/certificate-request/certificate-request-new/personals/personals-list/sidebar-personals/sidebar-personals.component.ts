import { Component, OnInit, ViewEncapsulation, Input, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PersonalsService } from '../personals.service';
import { Hsm, Token } from 'app/main/models/Equipment'
import { map, takeUntil } from "rxjs/operators";
import {  Subject } from "rxjs";
import { ToastrService } from 'ngx-toastr';
import { HsmListService } from 'app/main/apps/equipment-management/hsm-management/hsm-list.service';
import { DomSanitizer } from '@angular/platform-browser';
import { PersonalDetail } from 'app/main/models/Personal';
import { AddressService } from 'app/main/apps/identity-provider/address.service';

@Component({
  selector: 'app-sidebar-personals',
  templateUrl: './sidebar-personals.component.html',
  styleUrls: ['./sidebar-personals.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [AddressService]
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
  public strProfile: string = "";
  public listProfiles: any[] = [
    {
      "nameProfile": "PROFILE 1: CN, GIVENNAME, SURNAME, EMAIL, UID, OU, ST, L",
      "subjectDNA": [
        "CN",
        "GIVENNAME",
        "SURNAME",
        "EMAIL",
        "UID",
        "OU",
        "ST",
        "L"
      ],
      "subjectAttribute": [
        "OID"
      ],
      "id": 1
    },
    {
      "nameProfile": "PROFILE 2: CN, EMAIL, UID, OU, ST, L",
      "subjectDNA": [
        "CN",
        "GIVENNAME",
        "SURNAME",
        "EMAIL",
        "UID",
        "OU",
        "ST",
        "L"
      ],
      "subjectAttribute": [
        "OID"
      ],
      "id": 2
    },
    {
      "nameProfile": "PROFILE 3: CN, UID, OU",
      "subjectDNA": [
        "CN",
        "UID",
        "OU"
      ],
      "subjectAttribute": [
        "OID"
      ],
      "id": 3
    },
    {
      "nameProfile": "PROFILE 4: CN, ST, L",
      "subjectDNA": [
        "CN",
        "ST",
        "L"
      ],
      "subjectAttribute": [
        "OID"
      ],
      "id": 4
    },
    {
      "nameProfile": "PROFILE 5: CN",
      "subjectDNA": [
        "CN"
      ],
      "subjectAttribute": [
        "OID"
      ],
      "id": 5
    },
    {
      "nameProfile": "PROFILE 6: UID",
      "subjectDNA": [
        "UID"
      ],
      "subjectAttribute": [
        "OID"
      ],
      "id": 6
    },
  ]

  @Input() personal: PersonalDetail;
  @ViewChild('modalLink') modalLink;

  get f() {
    return this.newRequestForm.controls;
  }
  constructor(
    private fb: FormBuilder,
    private modal: NgbModal,
    private _personalsService: PersonalsService,
    private   toastr: ToastrService,
    private _hsmService: HsmListService,
    private sanitizer: DomSanitizer,
    private _addressService: AddressService
  ) { }

  ngOnInit(): void {
    this.newRequestForm = this.fb.group(
      {
        cryptoSystem: [null, Validators.required],
        keypairLength: [{value:null, disabled : true}, Validators.required],
        alias: [null, Validators.required],
        tokenId: [{value:null, disabled : true}, Validators.required],
        subscriberId: [this.personal.subscriberId],
        hsmInformationId: [null, Validators.required],
        profile: [[], Validators.required]
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

  changeProfile() {
    const profile: any[] = this.f.profile.value.subjectDNA
    this.strProfile = ""
    let firstWord = true
    profile.map((attribute: string) => {
      let value = "";
      switch (attribute) {
        case "CN":
          value = this.personal.personalFirstName + " " + this.personal.personalMiddleName + " " + this.personal.personalLastName
          this.displayProfile(attribute, value, firstWord)
          firstWord = false
          break;
        case "GIVENNAME":
          value = this.personal.personalMiddleName + " " + this.personal.personalLastName
          this.displayProfile(attribute, value, firstWord)
          firstWord = false
          break;
        case "SURNAME":
          value = this.personal.personalFirstName
          this.displayProfile(attribute, value, firstWord)
          firstWord = false
          break;
        case "EMAIL":
          value =  this.personal.email
          this.displayProfile(attribute, value, firstWord)
          firstWord = false
          break;
        case "UID":
          value = this.personal.personalCountryId
          this.displayProfile(attribute, value, firstWord)
          firstWord = false
          break;
        case "OU":
          value =  this.personal.organization.organizationName
          this.displayProfile(attribute, value, firstWord)
          firstWord = false
          break;
        case "ST":
          this._addressService.getProvinceName(this.personal.address.provinceId).subscribe((res: any) => {
            value = res.data.provinceName
            this.displayProfile(attribute, value, firstWord)
          })
          firstWord = false
          break;
        case "L":
          this._addressService.getDistrictName(this.personal.address.districtId).subscribe((res: any) => {
            value = res.data.districtName
            this.displayProfile(attribute, value, firstWord)
          })
          firstWord = false
          break;
      }
    })
  }

  displayProfile(attribute, value, firstWord) {
    if(firstWord == false)
      this.strProfile += ", " + attribute + " = " + value
    else {
      this.strProfile += attribute + " = " + value
    }
  }

  onSubmit() {
    this.submitted = true;
    if (this.newRequestForm.invalid) {
      return;
    }
    const newRequest = JSON.stringify({
      cryptoSystem: this.f.cryptoSystem.value,
      keypairLength: this.f.keypairLength.value,
      alias: this.f.alias.value,
      tokenId: this.f.tokenId.value,
      templateKeyId: 'keypairtemplate_00001',
      subscriberId: this.f.subscriberId.value,
    });
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

