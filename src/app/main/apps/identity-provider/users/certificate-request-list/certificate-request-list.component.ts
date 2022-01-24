import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ColumnMode, SelectionType } from '@swimlane/ngx-datatable';
import { AuthenticationService } from 'app/auth/service';
import { HsmService } from 'app/main/apps/equipment-management/hsm-management/hsm.service';
import { CertificateRequest } from 'app/main/models/CertificateRequest';
import { Hsm, Token } from 'app/main/models/Equipment';
import { PagedData } from 'app/main/models/PagedData';
import { Personal } from 'app/main/models/Personal';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { AddressService } from '../../address.service';
import { EntityProfileService } from '../../entity-profiles/entity-profile.service';
import { UsersService } from '../users.service';

@Component({
  selector: 'app-certificate-request-list',
  templateUrl: './certificate-request-list.component.html',
  styleUrls: ['./certificate-request-list.component.scss'],
})
export class CertificateRequestListComponent implements OnInit {
  public isLoading: boolean = false;
  private _unsubscribeAll = new Subject();
  public rowsData = new Array<CertificateRequest>();
  public chkBoxSelected = [];
  public SelectionType = SelectionType;
  public selected = [];
  public rowDataSelected = [];
  public ColumnMode = ColumnMode;
  public pagedData = new PagedData<CertificateRequest>();
  public sizePage: number[] = [5, 10, 15, 20, 50, 100];
  public totalItems: any = 0;
  public hsmList = new Array<Hsm>();
  public submitted = false;
  public tokenList: Token[];
  public fileUrl;
  public fileName;
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
  public strProfile: string = '';
  public personal : Personal;
  public listProfiles: any[] = [];
  public address: any;
  public bodyGetListProfile = {
    "page": 0,
    "size": 10,
    "sort": [],
    "contains": "",
    "fromDate": "",
    "toDate": ""
  }
  @ViewChild('modalLink') modalLink;

  get f() {
    return this.newRequestForm.controls;
  }

  //form group
  public newRequestForm: FormGroup;
  public formListCertificateRequest: FormGroup;

  constructor(
    private modal: NgbModal,
    private fb: FormBuilder,
    private _usersService: UsersService,
    private _hsmService: HsmService,
    private _authenticationService: AuthenticationService,
    private _entityProfileService: EntityProfileService,
    private _addressService: AddressService,
    private toastr: ToastrService,
    private sanitizer: DomSanitizer,
  ) {}

  async ngOnInit() {
    if (this._authenticationService.isStaff) {
      this.personal = await this._usersService
        .getStaffSelf()
        .pipe(takeUntil(this._unsubscribeAll))
        .toPromise()
        .then((res) => {
          return res.data;
        });
      }
    this.formListCertificateRequest = this.fb.group({
      contains: [null],
      fromDate: [null],
      sort: [null],
      toDate: [null],
      page: [null],
      size: [this.sizePage[3]],
    });
    this.setPage({
      offset: 0,
      pageSize: this.formListCertificateRequest.get('size').value,
    });

       //get ListHsm
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
     this.getListProfiles();
  }

  openToggleSidebar(modalForm) {
    this.modal.open(modalForm, { size: 'xl' });
  }
  customCheckboxOnSelect({ selected }) {
    this.chkBoxSelected.splice(0, this.chkBoxSelected.length);
    this.chkBoxSelected.push(...selected);
  }
  onSelect({ selected }) {
    console.log('Select Event', selected, this.selected);
    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
  }
  getOrganization(item): any {
    let info = this._usersService.readCertificate(
      item.certificateRequestContent
    );
    let rs = info.find((obj) => obj.name === 'organizationalUnitName');
    if (rs == undefined) return;
    return rs.value;
  }
  getSubscribe(item): any {
    let info = this._usersService.readCertificate(
      item.certificateRequestContent
    );
    return info.find((obj) => obj.name === 'commonName').value;
  }
  setPage(pageInfo) {
    this.isLoading = true;
    this.formListCertificateRequest.patchValue({ page: pageInfo.offset });
    this._usersService
      .getListCertificateRequests(
        JSON.stringify(this.formListCertificateRequest.value)
      )
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((pagedData) => {
        this.totalItems = pagedData.data.totalItems;
        this.pagedData = pagedData.data;
        this.rowsData = pagedData.data.data;
        this.rowsData = pagedData.data.data.map((item) => ({
          ...item,
          organizationName: this.getOrganization(item),
          subscribeName: this.getSubscribe(item),
        }));
        console.log(this.rowsData);
        this.isLoading = false;
      });
  }

  getListProfiles() {
    this._entityProfileService.getListProfiles(this.bodyGetListProfile)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((res) => {

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
        console.log(this.listProfiles);
      })
  }

  checkAlias(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<{ [key: string]: any } | null> => {
      return this._usersService
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
    let keypairId = await this._usersService.createKeypair(newRequest).toPromise().then(res => {
      return res.data.keypairId;
    }
    );
    if (keypairId == null) {
      return;
    }
    this._usersService.createCertificateRequest(JSON.stringify({ keypairId: keypairId })).subscribe((res: any) => {
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
  downloadSidebarCert(row) {
    const data = row.certificateRequest;
    // console.log(data)
    const blob = new Blob([data], { type: 'application/octet-stream' });
    row.fileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      window.URL.createObjectURL(blob)
    );
    row.fileName = row.keypairAlias + 'requestId' + row.certificateRequestId + '.csr';
    console.log(row);
  }
  
  
  async changeProfile() {
    const profile: any[] = this.f.profile.value.subjectDNA;
    console.log(profile);
    this.strProfile = '';
    let firstWord = true;
    profile.map(async (attribute: string) => {
      let value = '';
      this.address = await this._addressService.getAddressById(this.personal.address.addressId)
        .pipe(takeUntil(this._unsubscribeAll))
        .toPromise().then(res => {
          return res.data;
        });
      console.log(this.address)

      var fullName = this.personal.firstName + ' ' +this.personal.middleName + ' ' + this.personal.lastName;
      var streetAddress = "Số nhà " + this.address.houseNumber + " " +" Đường " + this.address.streetName + " " +" Xã "+ this.address.communeName;
      var countryCode = this.personal.personalCountryId;
      var stateOrProvinceName = "Tỉnh " + this.address.provinceName;
      var localityName = "Huyện " + this.address.districtName;
      var personalCountryId = this.personal.personalCountryId;
      var phoneNumber = this.personal.phoneNumber;
      var email = this.personal.email;
      
      // console.log(address)
      switch (attribute) {
        case 'CN':
          value = fullName
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

  toggleSidebar() {
    this.modal.dismissAll();
  }
}
