import {
  Component,
  OnInit,
  ViewEncapsulation,
  Input,
  ViewChild,
} from '@angular/core';
import {
  AbstractControl,
  AsyncValidatorFn,
  FormBuilder,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PersonalsService } from '../personals.service';
import { Hsm, Token } from 'app/main/models/Equipment';
import { map, takeUntil } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { DomSanitizer } from '@angular/platform-browser';
import { PersonalDetail } from 'app/main/models/Personal';
import { AddressService } from 'app/main/apps/identity-provider/address.service';
import { HsmService } from 'app/main/apps/equipment-management/hsm-management/hsm.service';
import { controllers } from 'chart.js';

@Component({
  selector: 'app-sidebar-personals',
  templateUrl: './sidebar-personals.component.html',
  styleUrls: ['./sidebar-personals.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [AddressService],
})
export class SidebarPersonalsComponent implements OnInit {
  private _unsubscribeAll = new Subject();
  public newRequestForm: FormGroup;
  public submitted = false;

  public fileUrl;
  public fileName;

  //form data
  public cryptoSelect: any[] = ['RSA', 'ECDSA'];
  public rsaKeyLength: any[] = [];
  public ecdsaKeyLength: any[] = ['secp224r1', 'secp384r1', 'secp521r1'];
  public lengthSelect = this.rsaKeyLength;

  // public cryptoAlgorithm = {
  //   RSA: ['1024', '1536', '2048', '3072', '4096', '6144', '8192'],
  //   ECDSA: ['secp224r1', 'secp384r1', 'secp521r1'],
  // };
  public cryptoAlgorithm = [
    {
      cryptoSystem: 'RSA',
      keypairLength: ['1024', '1536', '2048', '3072', '4096', '6144', '8192'],
    },
    {
      cryptoSystem: 'ECDSA',
      keypairLength: ['secp224r1', 'secp384r1', 'secp521r1'],
    },
  ];
  public keypairLengthList = this.cryptoAlgorithm[0].keypairLength;
  public tokenList: Token[];
  public hsmList = new Array<Hsm>();
  public strProfile: string = '';
  public listProfiles: any[] = [
    {
      nameProfile: 'PROFILE 1: CN, GIVENNAME, SURNAME, EMAIL, UID, OU, ST, L',
      subjectDNA: [
        'CN',
        'GIVENNAME',
        'SURNAME',
        'EMAIL',
        'UID',
        'OU',
        'ST',
        'L',
      ],
      subjectAttribute: ['OID'],
      id: 1,
    },
    {
      nameProfile: 'PROFILE 2: CN, EMAIL, UID, OU, ST, L',
      subjectDNA: [
        'CN',
        'GIVENNAME',
        'SURNAME',
        'EMAIL',
        'UID',
        'OU',
        'ST',
        'L',
      ],
      subjectAttribute: ['OID'],
      id: 2,
    },
    {
      nameProfile: 'PROFILE 3: CN, UID, OU',
      subjectDNA: ['CN', 'UID', 'OU'],
      subjectAttribute: ['OID'],
      id: 3,
    },
    {
      nameProfile: 'PROFILE 4: CN, ST, L',
      subjectDNA: ['CN', 'ST', 'L'],
      subjectAttribute: ['OID'],
      id: 4,
    },
    {
      nameProfile: 'PROFILE 5: CN',
      subjectDNA: ['CN'],
      subjectAttribute: ['OID'],
      id: 5,
    },
    {
      nameProfile: 'PROFILE 6: UID',
      subjectDNA: ['UID'],
      subjectAttribute: ['OID'],
      id: 6,
    },
  ];

  @Input() personal: any;
  @ViewChild('modalLink') modalLink;

  get f() {
    return this.newRequestForm.controls;
  }
  constructor(
    private fb: FormBuilder,
    private modal: NgbModal,
    private _personalsService: PersonalsService,
    private toastr: ToastrService,
    private _hsmService: HsmService,
    private sanitizer: DomSanitizer,
    private _addressService: AddressService
  ) {}
  public hsmListSub = new Subject();
  async ngOnInit() {
    await this._hsmService
      .getListHsm({
        page: 0,
        size: 100,
      })
      .pipe(
        map((res) => {
          res.data.data.forEach((element, index) => {
            if (element.tokens.length == 0) {
              delete res.data.data[index];
            }
          });
          return res.data.data.filter((x) => x !== null);
        }),
        takeUntil(this._unsubscribeAll)
      )
      .toPromise()
      .then((hsmList) => {
        console.log(hsmList);
        this.hsmList = hsmList;
        this.tokenList = this.hsmList[0].tokens;
      });
    this.newRequestForm = this.fb.group(
      {
        cryptoAlgorithm: this.fb.group({
          cryptoSystem: [this.cryptoAlgorithm[0], Validators.required],
          keypairLength: [this.keypairLengthList[0], Validators.required],
        }),
        alias: [
          this.personal.username +
            Math.floor(Math.random() * 1000 + 1), Validators.required, [this.checkAlias()]]
        ,
        tokenId: [this.tokenList[0], Validators.required],
        userId: [this.personal.userId],
        hsm: [this.hsmList[0]],
        profile: [null, Validators.required],
      }
    );
  }

  toggleSidebar() {
    this.modal.dismissAll();
  }

  downloadSidebar(res) {
    this.modal.open(this.modalLink);
    const data = res.data.certificateRequestContent;
    const blob = new Blob([data], { type: 'application/octet-stream' });
    this.fileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      window.URL.createObjectURL(blob)
    );
    // this.fileName = res.data.certificateRequestId + '.csr';
    this.fileName = res.data.keypairAlias + '.csr';
  }
  changeCrypto() {
    this.keypairLengthList = this.newRequestForm
      .get('cryptoAlgorithm')
      .get('cryptoSystem').value.keypairLength;
    this.newRequestForm
      .get('cryptoAlgorithm')
      .patchValue({ keypairLength: this.keypairLengthList[0] });
  }

  changeHsm() {
    this.tokenList = this.newRequestForm.get('hsm').value.tokens;
    this.newRequestForm.patchValue({ tokenId: this.tokenList[0] });
  }

  changeProfile() {
    const profile: any[] = this.f.profile.value.subjectDNA;
    this.strProfile = '';
    let firstWord = true;
    profile.map((attribute: string) => {
      let value = '';
      switch (attribute) {
        case 'CN':
          value =
            this.personal.personalFirstName +
            ' ' +
            this.personal.personalMiddleName +
            ' ' +
            this.personal.personalLastName;
          this.displayProfile(attribute, value, firstWord);
          firstWord = false;
          break;
        case 'GIVENNAME':
          value =
            this.personal.personalMiddleName +
            ' ' +
            this.personal.personalLastName;
          this.displayProfile(attribute, value, firstWord);
          firstWord = false;
          break;
        case 'SURNAME':
          value = this.personal.personalFirstName;
          this.displayProfile(attribute, value, firstWord);
          firstWord = false;
          break;
        case 'EMAIL':
          value = this.personal.email;
          this.displayProfile(attribute, value, firstWord);
          firstWord = false;
          break;
        case 'UID':
          value = this.personal.personalCountryId;
          this.displayProfile(attribute, value, firstWord);
          firstWord = false;
          break;
        case 'OU':
          value = this.personal.organization.organizationName;
          this.displayProfile(attribute, value, firstWord);
          firstWord = false;
          break;
        case 'ST':
          this._addressService
            .getProvinceName(this.personal.address.provinceId)
            .subscribe((res: any) => {
              value = res.data.provinceName;
              this.displayProfile(attribute, value, firstWord);
            });
          firstWord = false;
          break;
        case 'L':
          this._addressService
            .getDistrictName(this.personal.address.districtId)
            .subscribe((res: any) => {
              value = res.data.districtName;
              this.displayProfile(attribute, value, firstWord);
            });
          firstWord = false;
          break;
      }
    });
  }

  displayProfile(attribute, value, firstWord) {
    if (firstWord == false) this.strProfile += ', ' + attribute + ' = ' + value;
    else {
      this.strProfile += attribute + ' = ' + value;
    }
  }
  async onSubmit() {
    this.submitted = true;
    if (this.newRequestForm.invalid) {
      return;
    }

    const newRequest = JSON.stringify({
      cryptoAlgorithm: [this.newRequestForm
        .get('cryptoAlgorithm')
        .get('cryptoSystem').value.cryptoSystem, this.newRequestForm
        .get('cryptoAlgorithm')
        .get('keypairLength').value],
      alias: this.f.alias.value,
      tokenId: this.f.tokenId.value.tokenId,
      templateKeyId: '1',
      userId: this.f.userId.value,
    });
    console.log(newRequest);
    let keypairId = await this._personalsService.createKeypair(newRequest).toPromise().then(res=>
      {
        return res.data.keypairId;
      }
      );
      if(keypairId==null){
        return;
      }
    this._personalsService.createCertificateRequest(JSON.stringify({keypairId: keypairId})).subscribe((res: any) => {
      console.log(res);
      if ((res.result = true)) {
        this.toggleSidebar();
        this.toastr.success(
          '👋 Bạn đã tạo yêu cầu chứng thực mới',
          'Thành công',
          {
            positionClass: 'toast-top-center',
            toastClass: 'toast ngx-toastr',
            closeButton: true,
          }
        );
        this.downloadSidebar(res);
      }
    });
  }

  checkAlias(): AsyncValidatorFn  {
    return  (control: AbstractControl) : Observable<{ [key: string]: any } | null> => {
      return this._personalsService
        .checkAlias(control.value)
        .pipe(map((res) => {
          if(res.data) {
            return { used: true }
          }else {
            return null;
          }
        }));
    }
  }
}
