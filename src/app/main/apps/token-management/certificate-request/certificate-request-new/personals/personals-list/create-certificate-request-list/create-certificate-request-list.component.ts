import { EntityProfileService } from './../../../../../../identity-provider/entity-profiles/entity-profile.service';
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
import { ColumnMode, SelectionType } from '@swimlane/ngx-datatable';
import { PagedData } from 'app/main/models/PagedData';
import { Keypair } from 'app/main/models/Keypair';
import { KeypairListService } from 'app/main/apps/token-management/keypair/keypair-list/keypair-list.service';

@Component({
  selector: 'app-create-certificate-request-list',
  templateUrl: './create-certificate-request-list.component.html',
  styleUrls: ['./create-certificate-request-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [AddressService],
})
export class CreateCertificateRequestListComponent implements OnInit {

  private _unsubscribeAll = new Subject();
  public newRequestForm: FormGroup;
  public submitted = false;

  public fileUrl;
  public fileName;

  //form data
  public cryptoSelect: any[] = ['RSA', 'ECDSA'];
  public rsaKeyLength: any[] = [];
  public ecdsaKeyLength: any[] = ['secp256r1', 'secp384r1', 'secp521r1'];
  public lengthSelect = this.rsaKeyLength;

  // public cryptoAlgorithm = {
  //   RSA: ['1024', '1536', '2048', '3072', '4096', '6144', '8192'],
  //   ECDSA: ['secp256r1', 'secp384r1', 'secp521r1'],
  // };
  public cryptoAlgorithm = [
    {
      cryptoSystem: 'RSA',
      keypairLength: ['1024', '1536', '2048', '3072', '4096', '6144', '8192'],
    },
    {
      cryptoSystem: 'ECDSA',
      keypairLength: ['secp256r1', 'secp384r1', 'secp521r1'],
    },
  ];
  public keypairLengthList = this.cryptoAlgorithm[0].keypairLength;
  public tokenList: Token[];
  public hsmList = new Array<Hsm>();
  public strProfile: string = '';
  public address: any
  public listProfiles: any[] = [];
  public chkBoxSelected = [];

  public pagedData = new PagedData<any>();
  public listSubjectDn = [
    {
      id:1,
      subjectDn:"CN = Nguyễn Hữu Tiến, UID = 0933833333, UID = 0933833333, OU = CMC CIST, OU = CMC CIST, O = CMC , STREET = Số nhà q Đường trần hưng đạo Xã Phúc Xá, L = Huyện Ba Đình, ST = Tỉnh Hà Nội, C = 0933833333"
    },
    {
      id:2,
      subjectDn:"CN = Nguyễn Hữu Tiến, UID = 0933833333, UID = 0933833333, OU = CMC CIST, OU = CMC CIST, O = CMC , STREET = Số nhà q Đường trần hưng đạo Xã Phúc Xá, L = Huyện Ba Đình, ST = Tỉnh Hà Nội, C = 0933833333"
    }
  ]
  public basicSelectedOption: number = 10;
  public SelectionType = SelectionType;
  public ColumnMode = ColumnMode
  public isLoading: boolean = false;
  public rowsData = new Array<Keypair>();
  public informationKeyPair:boolean = false;
  public informationKeypairOld:boolean = false;

  public formListPersonal: FormGroup;
  public sizePage: number[] = [5, 10, 15, 20, 50, 100];
  public bodyGetListProfile = {
    "page": 0,
    "size": 10,
    "sort": [],
    "contains": "",
    "fromDate": "",
    "toDate": ""
  }
  @Input() personals: any;
  @ViewChild('modalLink') modalLink;

  get f() {
    return this.newRequestForm.controls;
  }
  customCheckboxOnSelect({ selected }) {
    this.chkBoxSelected.splice(0, this.chkBoxSelected.length);
    this.chkBoxSelected.push(...selected);
  }
  constructor(
    private fb: FormBuilder,
    private modal: NgbModal,
    private _personalsService: PersonalsService,
    private toastr: ToastrService,
    private _hsmService: HsmService,
    private sanitizer: DomSanitizer,
    private _addressService: AddressService,
    private _entityProfileService: EntityProfileService,
    private _keypairService: KeypairListService,
  ) { }
  public hsmListSub = new Subject();
  async ngOnInit() {
    console.log(this.personals)
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
          this.personals.username +
          Math.floor(Math.random() * 1000 + 1), Validators.required, [this.checkAlias()]]
        ,
        tokenId: [this.tokenList[0], Validators.required],
        userId: [this.personals.userId],
        hsm: [this.hsmList[0]],
        profile: [null, Validators.required],
      }
    );
    console.log(this.newRequestForm.value)
    this.getListProfiles();
    this.formListPersonal = this.fb.group({
      page: [null],
      size: [this.sizePage[2]],
      sort : [null],
      contains: [null, Validators.required],
      fromDate: [null],
      toDate: [null],
    });
    // this.pagedData.size = this.sizePage[3];
    // this.pagedData.currentPage = 0;
    this.setPage({ offset: 0, pageSize: this.formListPersonal.get('size').value });
  }

  toggleSidebar() {
    this.modal.dismissAll();
  }

  downloadSidebar(res) {
    this.modal.open(this.modalLink);
    const data = res.data.certificateRequestContent;
    console.log(data)
    const blob = new Blob([data], { type: 'application/octet-stream' });
    console.log(blob)
    this.fileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      window.URL.createObjectURL(blob)
    );
    // this.fileName = res.data.certificateRequestId + '.csr';
    this.fileName = res.data.keypairAlias + '.csr';
    console.log(this.fileName)
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

  async changeProfile() {
    const profile: any[] = this.f.profile.value.subjectDNA;
    console.log(profile);
    this.strProfile = '';
    let firstWord = true;
    profile.map(async (attribute: string) => {
      let value = '';
      this.address = await this._addressService.getAddressById(283)
        .pipe(takeUntil(this._unsubscribeAll))
        .toPromise().then(res => {
          return res.data;
        });
      console.log(this.address)

      var commonName = this.personals.personalFirstName;
      var streetAddress = "Số nhà " + this.address.houseNumber + " " +" Đường " + this.address.streetName + " " +" Xã "+ this.address.communeName;
      var countryCode = this.personals.personalCountryId;
      var stateOrProvinceName = "Tỉnh " + this.address.provinceName;
      var localityName = "Huyện " + this.address.districtName;
      var personalCountryId = this.personals.personalCountryId;
      var phoneNumber = this.personals.phoneNumber;
      var email = this.personals.email;
      
      // console.log(address)
      switch (attribute) {
        case 'CN':
          value = commonName
          this.displayProfile(attribute, value, firstWord);
          firstWord = false;
          break;
        case 'C':
          value = countryCode
          this.displayProfile(attribute, value, firstWord);
          firstWord = false;
        break;
        case 'ST':
          value = stateOrProvinceName
          this.displayProfile(attribute, value, firstWord);
          firstWord = false;
        break;
        case 'L':
          value = localityName
          this.displayProfile(attribute, value, firstWord);
          firstWord = false;
        break;
        case 'OU':
          value = "CMC CIST"
          this.displayProfile(attribute, value, firstWord);
          firstWord = false;
        break;
        case 'O':
          value = "CMC "
          this.displayProfile(attribute, value, firstWord);
          firstWord = false;
        break;
        case 'TELEPHONE_NUMBER':
          value = phoneNumber
          this.displayProfile(attribute, value, firstWord);
          firstWord = false;
        break;
        
        case 'EmailAddress':
          value = email;
          this.displayProfile(attribute, value, firstWord);
          firstWord = false;
          break;
        case 'UID':
          value = personalCountryId;
          this.displayProfile(attribute, value, firstWord);
          firstWord = false;
          break;
        case 'STREET':
          value = streetAddress;
          this.displayProfile(attribute, value, firstWord);
          firstWord = false;
          break; 
      }
    });
  }

  displayProfile(attribute, value, firstWord) {
    console.log(value);
    console.log(attribute);
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
    let keypairId = await this._personalsService.createKeypair(newRequest).toPromise().then(res => {
      return res.data.keypairId;
    }
    );
    if (keypairId == null) {
      return;
    }
    this._personalsService.createCertificateRequest(JSON.stringify({ keypairId: keypairId })).subscribe((res: any) => {
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
  getListProfiles() {
    this._entityProfileService.getListProfiles(this.bodyGetListProfile)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((res) => {
        this.newRequestForm.controls['profile'].setValue(res.data.data[0].endEntityProfileName)
        
        // this.
        console.log(res)
        this.listProfiles = res.data.data.map((profile) => ({
          ...profile,
          subjectAttribute: profile.alternativeName.map(item => {
            return item.name
          }),
          subjectDNA: profile.distinguishedName.map(item => {
            return item.name
          }),
          id: profile.endEntityProfileId,
          nameProfile: profile.endEntityProfileName
        }))
        var profile = this.listProfiles[0].subjectDNA
        this.strProfile = '';
        let firstWord = true; 
        profile.map(async (attribute: string) => {
          let value = '';
          this.address = await this._addressService.getAddressById(283)
            .pipe(takeUntil(this._unsubscribeAll))
            .toPromise().then(res => {
              return res.data;
            });
          console.log(this.address)
    
          var commonName = this.personals.personalFirstName;
          var streetAddress = "Số nhà " + this.address.houseNumber + " " +" Đường " + this.address.streetName + " " +" Xã "+ this.address.communeName;
          var countryCode = this.personals.personalCountryId;
          var stateOrProvinceName = "Tỉnh " + this.address.provinceName;
          var localityName = "Huyện " + this.address.districtName;
          var personalCountryId = this.personals.personalCountryId;
          var phoneNumber = this.personals.phoneNumber;
          var email = this.personals.email;
          
          // console.log(address)
          switch (attribute) {
            case 'CN':
              value = commonName
              this.displayProfile(attribute, value, firstWord);
              firstWord = false;
              break;
            case 'C':
              value = countryCode
              this.displayProfile(attribute, value, firstWord);
              firstWord = false;
            break;
            case 'ST':
              value = stateOrProvinceName
              this.displayProfile(attribute, value, firstWord);
              firstWord = false;
            break;
            case 'L':
              value = localityName
              this.displayProfile(attribute, value, firstWord);
              firstWord = false;
            break;
            case 'OU':
              value = "CMC CIST"
              this.displayProfile(attribute, value, firstWord);
              firstWord = false;
            break;
            case 'O':
              value = "CMC "
              this.displayProfile(attribute, value, firstWord);
              firstWord = false;
            break;
            case 'TELEPHONE_NUMBER':
              value = phoneNumber
              this.displayProfile(attribute, value, firstWord);
              firstWord = false;
            break;
            
            case 'EmailAddress':
              value = email;
              this.displayProfile(attribute, value, firstWord);
              firstWord = false;
              break;
            case 'UID':
              value = personalCountryId;
              this.displayProfile(attribute, value, firstWord);
              firstWord = false;
              break;
            case 'STREET':
              value = streetAddress;
              this.displayProfile(attribute, value, firstWord);
              firstWord = false;
              break; 
          }
        });
        // console.log(subjectDN)
        console.log(this.listProfiles);
      })
  }
  checkAlias(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<{ [key: string]: any } | null> => {
      return this._personalsService
        .checkAlias(control.value)
        .pipe(map((res) => {
          if (res.data) {
            return { used: true }
          } else {
            return null;
          }
        }));
    }
  }
  // open form information keypair
  openInformationKeyPair(){
    this.informationKeyPair =! this.informationKeyPair
    this.informationKeypairOld = false;
  }
  // get list keypair
  getListKeypair(){
    this.informationKeypairOld = !this.informationKeypairOld;
    this.informationKeyPair = false;

  }
  setPage(pageInfo) {
    console.log(pageInfo);
    const body = {
      page: null,
      size: pageInfo.pageSize,
      sort: null,
      contains: null,
      fromDate: null,
      toDate: null,
    };
      this._keypairService
      .getData(body)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((pagedData) => {
         console.log(pagedData)
        this.pagedData = pagedData.data;
        this.rowsData = pagedData.data.data;
        console.log(this.rowsData)
        this.rowsData = pagedData.data.data.map(item => ({
          ...item,
        }))
        this.isLoading=false;
      });
  }
}