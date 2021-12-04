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
import { stringify } from 'querystring';

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
  public strProfile: string = "";
  // public profileList: any[] = [
  //   [
  //     {
  //         "type": "2.5.4.3",
  //         "value": "HoangBaNguyen",
  //         "valueTagClass": 12,
  //         "name": "commonName",
  //         "shortName": "CN"
  //     },
  //     {
  //         "type": "2.5.4.6",
  //         "value": "VN",
  //         "valueTagClass": 19,
  //         "name": "countryName",
  //         "shortName": "C"
  //     },
  //     {
  //         "type": "2.5.4.8",
  //         "value": "Ha Noi",
  //         "valueTagClass": 12,
  //         "name": "stateOrProvinceName",
  //         "shortName": "ST"
  //     },
  //     {
  //         "type": "2.5.4.7",
  //         "value": "Ha Dong",
  //         "valueTagClass": 12,
  //         "name": "localityName",
  //         "shortName": "L"
  //     },
  //     {
  //         "type": "2.5.4.11",
  //         "value": "CMC CIST",
  //         "valueTagClass": 12,
  //         "name": "organizationalUnitName",
  //         "shortName": "OU"
  //     },
  //     {
  //         "type": "2.5.4.10",
  //         "value": "CMC",
  //         "valueTagClass": 12,
  //         "name": "organizationName",
  //         "shortName": "O"
  //     },
  //     {
  //         "type": "0.9.2342.19200300.100.1.1",
  //         "value": "145773219",
  //         "valueTagClass": 12
  //     },
  //     {
  //         "type": "2.5.4.20",
  //         "value": "0889717422",
  //         "valueTagClass": 19
  //     },
  //     {
  //         "type": "1.2.840.113549.1.9.1",
  //         "value": "hunga1k15tv111@gmail.com",
  //         "valueTagClass": 22,
  //         "name": "emailAddress",
  //         "shortName": "E"
  //     },
  //     {
  //         "type": "2.5.4.9",
  //         "value": "Nguyen Trai",
  //         "valueTagClass": 12,
  //         "name": "streetAddress"
  //     }
  //   ]
  // ]
  // public listProfiles: any[] = [
  //   {
  //     "nameProfile": "TIEN",
  //     "subjectDNA": [
  //       "EMAIL"
  //     ],
  //     "subjectAttribute": [
  //       "OID"
  //     ],
  //     "id": 1
  //   },
  //   {
  //     "nameProfile": "TIEN",
  //     "subjectDNA": [
  //       "EMAIL"
  //     ],
  //     "subjectAttribute": [
  //       "OID"
  //     ],
  //     "id": 2
  //   },
  //   {
  //     "nameProfile": "TIEN",
  //     "subjectDNA": [
  //       "EMAIL"
  //     ],
  //     "subjectAttribute": [
  //       "OID"
  //     ],
  //     "id": 3
  //   },
  //   {
  //     "nameProfile": "TIEN",
  //     "subjectDNA": [
  //       "EMAIL"
  //     ],
  //     "subjectAttribute": [
  //       "OID"
  //     ],
  //     "id": 4
  //   },
  //   {
  //     "nameProfile": "ádasd",
  //     "subjectDNA": [
  //       "SUBRNAME",
  //       "SUBRNAME",
  //       "L",
  //       "L"
  //     ],
  //     "subjectAttribute": [
  //       "OID"
  //     ],
  //     "id": 5
  //   },
  //   {
  //     "nameProfile": "CMC",
  //     "subjectDNA": [
  //       "EMAIL"
  //     ],
  //     "subjectAttribute": [
  //       "MS UPN"
  //     ],
  //     "id": 6
  //   },
  //   {
  //     "nameProfile": null,
  //     "subjectDNA": [
  //       "EMAIL",
  //       "CN",
  //       "GIVENNAME"
  //     ],
  //     "subjectAttribute": [
  //       "MS UPN",
  //       "IPA",
  //       "OID"
  //     ],
  //     "id": 7
  //   },
  //   {
  //     "nameProfile": null,
  //     "subjectDNA": [
  //       "SUBRNAME",
  //       "SUBRNAME"
  //     ],
  //     "subjectAttribute": [
  //       "OID",
  //       "MS UPN"
  //     ],
  //     "id": 8
  //   },
  //   {
  //     "nameProfile": "CMC CIST",
  //     "subjectDNA": [
  //       "UID",
  //       "UID",
  //       "UID",
  //       "INITIALS",
  //       "C"
  //     ],
  //     "subjectAttribute": [
  //       "URI",
  //       "DN",
  //       "DN",
  //       "XA"
  //     ],
  //     "id": 9
  //   },
  //   {
  //     "nameProfile": null,
  //     "subjectDNA": [
  //       "SDN"
  //     ],
  //     "subjectAttribute": [
  //       "OID"
  //     ],
  //     "id": 10
  //   }
  // ]

  public listProfiles: any[] =[
    {
      "nameProfile": "PROFILE 1",
      "subjectDNA": [
        {
          "name": "CN",
          "value": "Nguyễn Hữu Tiến",
        },
        {
          "name": "C",
          "value": "VN"
        },
        {
          "name": "ST",
          "value": "Hà Nội"
        },
        {
          "name": "L",
          "value": "Cầu Giấy"
        },
        {
          "name": "OU",
          "value": "CMC CIST"
        },
        {
          "name": "O",
          "value": "CMC"
        },
        {
          "name": "E",
          "value": "nguyenhuutien@gmail.com"
        },
      ],
      "subjectAttribute": [
        "OID"
      ],
      "id": 1
    },
    {
      "nameProfile": "PROFILE 2",
      "subjectDNA": [
        {
          "name": "CN",
          "value": "Mạc Duy Tân",
        },
        {
          "name": "C",
          "value": "VN"
        },
        {
          "name": "ST",
          "value": "Hà Nội"
        },
        {
          "name": "L",
          "value": "Hà Đông"
        },
        {
          "name": "OU",
          "value": "CMC CIST"
        },
        {
          "name": "O",
          "value": "CMC"
        },
        {
          "name": "E",
          "value": "macduytan@gmail.com"
        },
      ],
      "subjectAttribute": [
        "OID"
      ],
      "id": 2
    },
    {
      "nameProfile": "PROFILE 3",
      "subjectDNA": [
        {
          "name": "CN",
          "value": "Lê Quang Huy",
        },
        {
          "name": "C",
          "value": "VN"
        },
        {
          "name": "OU",
          "value": "CMC CIST"
        },
        {
          "name": "O",
          "value": "CMC"
        },
        {
          "name": "E",
          "value": "lequanghuy@gmail.com"
        },
      ],
      "subjectAttribute": [
        "OID"
      ],
      "id": 3
    },
    {
      "nameProfile": "PROFILE 4",
      "subjectDNA": [
        {
          "name": "CN",
          "value": "Nguyễn Tiến Hải Ninh",
        },
        {
          "name": "E",
          "value": "lequanghuy@gmail.com"
        }
      ],
      "subjectAttribute": [
        "OID"
      ],
      "id": 4
    }
  ]

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
    private _hsmService: HsmListService,
    private sanitizer: DomSanitizer
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
    const profile = this.f.profile.value.subjectDNA;
    this.strProfile = "";
    const len = profile.length;
    for (let i = 0; i < len; i++) {
      this.strProfile += profile[i].name + " = " + profile[i].value;
      if (i < len-1)
        this.strProfile += ", ";
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

