import {
  Component,
  OnInit,
  ViewChild,
  ViewEncapsulation,
  Input,
} from '@angular/core';
import {
  AbstractControl,
  AsyncValidatorFn,
  FormBuilder,
  FormControl,
  FormGroup,
  NgForm,
  Validators,
} from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { Personal } from 'app/main/models/Personal';
import { UsersService } from '../users.service';
import { User } from 'app/auth/models';
import { AuthenticationService } from 'app/auth/service';
import { map, takeUntil } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { Router } from '@angular/router';
import { Organization } from 'app/main/models/Organization';
import { Province, District, Commune, Street } from 'app/main/models/Address';
import { OrganizationListService } from '../../subscribers/organizations/organization-list/organization-list.service';
import { AddressService } from '../../address.service';
import Swal from 'sweetalert2';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import {
  ColumnMode,
  DatatableComponent,
  SelectionType,
} from '@swimlane/ngx-datatable';
import { PagedData } from 'app/main/models/PagedData';
import { SubscriberCertificate } from 'app/main/models/SubscriberCertificate';
import { SubscriberCertificateListService } from 'app/main/apps/token-management/subscriber-certificate/subscriber-certificate-list/subscriber-certificate-list.service';
import { CertificateRequest } from 'app/main/models/CertificateRequest';
import { CertificateRequestListService } from 'app/main/apps/token-management/certificate-request/certificate-request-list/certificate-request-list.service';
import { SidebarPersonalsComponent } from 'app/main/apps/token-management/certificate-request/certificate-request-new/personals/personals-list/sidebar-personals/sidebar-personals.component';
import { Hsm, Token } from 'app/main/models/Equipment';
import { HsmService } from 'app/main/apps/equipment-management/hsm-management/hsm.service';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ProfileComponent implements OnInit {
  private _unsubscribeAll = new Subject();
  public subscriberCategoryName;
  public contentHeader: object;
  public rows;
  public tempRow;
  public item: any;
  public flag: any;
  public image = '';
  roleArray: any[] = [];
  public getRoles;
  public personal: Personal;
  formRoleEdit: FormGroup;
  formUpdateRole: FormGroup;
  public modalRef;
  public personalSelected: Personal;
  public url = this.router.url;
  public organizationId: Organization[];
  public test: any[] = [];
  public countryResidencePlace = [
    {
      countryId: '237',
      countryName: 'Việt Nam',
      countryCode: 'VN',
      countryType: 'Independent State',
    },
  ];
  public countryBirthPlace: any[] = [
    {
      countryId: '237',
      countryName: 'Việt Nam',
      countryCode: 'VN',
      countryType: 'Independent State',
    },
  ];

  public provinceBirthPlace: Province[];
  public districtBirthPlace: District[];
  public communeBirthPlace: Commune[];
  public streetBirthPlace: Street[];

  public provinceResidencePlace: Province[];
  public districtResidencePlace: District[];
  public communeResidencePlace: Commune[];
  public streetResidencePlace: Street[];

  public gender: string[] = ['Nam', 'Nữ'];

  public SelectionType = SelectionType;
  public chkBoxSelected = [];
  public selected = [];
  public rowDataSelected = [];

  public sizePage: number[] = [5, 10, 15, 20, 50, 100];
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
  public strProfile: string = '';
  public keypairLengthList = this.cryptoAlgorithm[0].keypairLength;
  public tokenList: Token[];
  public hsmList = new Array<Hsm>();

  //page setup
  @ViewChild(DatatableComponent) table: DatatableComponent;
  @ViewChild('tableRowDetails') tableRowDetails: any;
  // Danh sách chứng thư số
  public pagedData = new PagedData<SubscriberCertificate>();
  public rowsData = new Array<SubscriberCertificate>();
  public isLoading: boolean = false;
  public totalItems: any = 0;
  public ColumnMode = ColumnMode;
  // get string base64
  public base64textString: String = '';
  // Danh sách yêu cầu chứng thực
  public rowsDataCRL = new Array<CertificateRequest>();
  public pagedDataCRL = new PagedData<CertificateRequest>();
  public formListCertificateRequest: FormGroup;
  public formUploadAvatar: FormGroup;
  private readonly currentUser = JSON.parse(
    localStorage.getItem('currentUser')
  );

  // public avatarImage: string ;
  @ViewChild('accountForm') accountForm: NgForm;
  // FormGroups
  formProfile: FormGroup;
  formInfoEdit: FormGroup;
  formUploadCert: FormGroup;
  newRequestForm: FormGroup;
  formListSubscriberCertificate: FormGroup;
  public submitted = false;

  constructor(
    private dateAdapter: DateAdapter<any>,
    // private _authenticationService:
    private toastr: ToastrService,
    private _usersService: UsersService,
    private fb: FormBuilder,
    private _addressService: AddressService,
    private _authenticationService: AuthenticationService,
    private _organizationListService: OrganizationListService,
    private router: Router,
    private modalService: NgbModal,
    private modal: NgbModal,
    private _toastrService: ToastrService,
    public _subscriberCertificateService: SubscriberCertificateListService,
    private _listCerReqService: CertificateRequestListService,
    private _hsmService: HsmService
  ) {
    this.formInfoEdit = this.fb.group({
      userId: [null, Validators.required],
      username: ['', [Validators.required]],
      subscriberCategoryId: ['1', [Validators.required]],
      firstName: [null, [Validators.required]],
      middleName: [null, [Validators.required]],
      lastName: [null, [Validators.required]],
      phoneNumber: [
        null,
        [
          Validators.required,
          Validators.minLength(10),
          Validators.pattern(
            /(01|03|05|07|08|09|02[0|1|2|3|4|5|6|7|8|9])+([0-9]{8})\b/
          ),
        ],
      ],
      personalCountryId: [
        null,
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(/^[0-9]\d*$/),
        ],
      ],
      organizationId: [null],
      streetBirthPlace: [null, Validators.required],
      countryBirthPlace: [
        this.countryBirthPlace[0].countryId,
        Validators.required,
      ],
      provinceBirthPlace: [null, Validators.required],
      districtBirthPlace: [null, Validators.required],
      communeBirthPlace: [null, Validators.required],
      homeNumberBirthPlace: [null, Validators.required],
      countryResidencePlace: [
        this.countryResidencePlace[0].countryId,
        Validators.required,
      ],
      provinceResidencePlace: [null, Validators.required],
      districtResidencePlace: [null, Validators.required],
      communeResidencePlace: [null, Validators.required],
      streetResidencePlace: [null, Validators.required],
      homeNumberResidencePlace: [null, Validators.required],
      gender: [null, [Validators.required]],
      birthday: [null, [Validators.required, Validators.minLength(22)]],
      email: [null, [Validators.required, Validators.email]],
      // certificate: [null, [Validators.required]],
    });
    this.formUploadAvatar = this.fb.group({
      avatar: [null, Validators.required],
    });

    this.formProfile = this.fb.group({
      username: ['', [Validators.required]],
      email: [null, [Validators.required, Validators.email]],
    });

    this.formUploadCert = this.fb.group({
      certificateContent: ['', Validators.required],
      userId: [null, Validators.required],
    });
    this.formRoleEdit = this.fb.group({
      adminRole: this.fb.group({
        hasRead: true,
        hasWrite: false,
        hasCreate: true,
        hasDelete: false,
      }),
      superAdminRole: this.fb.group({
        hasRead: true,
        hasWrite: false,
        hasCreate: false,
        hasDelete: false,
      }),
      userRole: this.fb.group({
        hasRead: false,
        hasWrite: true,
        hasCreate: false,
        hasDelete: true,
      }),
    });
    this.formUpdateRole = this.fb.group({
      username: [''],
      roles: [[]],
    });
  }
  async ngOnInit() {
    //get User-Email Account
    if (this.formInfoEdit.value.userId == null) {
      this.organizationId = await this._organizationListService
        .getAllOrganizations()
        .pipe(takeUntil(this._unsubscribeAll))
        .toPromise()
        .then((res) => {
          console.log(res.data);

          return res.data;
        });

      this.provinceBirthPlace = this.provinceResidencePlace =
        await this._addressService
          .getProvince()
          .pipe(
            map((res) => {
              const data = res.data.map((city) => ({
                ...city,
                provinceDisplay: city.provinceType + ' ' + city.provinceName,
              }));
              return data;
            }),
            takeUntil(this._unsubscribeAll)
          )
          .toPromise()
          .then((res) => {
            return res;
          });

      if (this._authenticationService.isStaff) {
        this.personal = await this._usersService
          .getStaffSelf()
          .pipe(takeUntil(this._unsubscribeAll))
          .toPromise()
          .then((res) => {
            return res.data;
          });

        this.formInfoEdit.patchValue({
          userId: this.personal.userId,
          username: this.personal.username,
          firstName: this.personal.firstName,
          middleName: this.personal.middleName,
          lastName: this.personal.lastName,
          phoneNumber: this.personal.phoneNumber,
          personalCountryId: this.personal.personalCountryId,
          birthday: this.personal.birthday,
          gender: this.personal.gender,
          email: this.personal.email,
          homeNumberBirthPlace: this.personal.birthPlace.houseNumber,
          homeNumberResidencePlace: this.personal.address.houseNumber,
        });

        this.organizationId.forEach((organization) => {
          if (organization.organizationName == this.personal.organizationName) {
            this.formInfoEdit
              .get('organizationId')
              .setValue(organization.organizationId);
          }
        });

        // set province birth place
        this.provinceBirthPlace.forEach((province) => {
          if (province.provinceId == this.personal.birthPlace.provinceId) {
            this.formInfoEdit
              .get('provinceBirthPlace')
              .setValue(province.provinceId);
          }
        });

        this.provinceResidencePlace.forEach((province) => {
          if (province.provinceId == this.personal.address.provinceId) {
            this.formInfoEdit
              .get('provinceResidencePlace')
              .setValue(province.provinceId);
          }
        });

        // get list district birth place
        this.districtBirthPlace = await this._addressService
          .getDistrict(this.personal.birthPlace.provinceId)
          .pipe(
            map((res) => {
              const data = res.data.map((district) => ({
                ...district,
                districtDisplay:
                  district.districtType + ' ' + district.districtName,
              }));
              return data;
            }),
            takeUntil(this._unsubscribeAll)
          )
          .toPromise()
          .then((res) => {
            return res;
          });

        this.districtBirthPlace.forEach((district) => {
          if (district.districtId == this.personal.birthPlace.districtId) {
            this.formInfoEdit
              .get('districtBirthPlace')
              .setValue(district.districtId);
          }
        });

        // get list district resident place
        this.districtResidencePlace = await this._addressService
          .getDistrict(this.personal.address.provinceId)
          .pipe(
            map((res) => {
              const data = res.data.map((district) => ({
                ...district,
                districtDisplay:
                  district.districtType + ' ' + district.districtName,
              }));
              return data;
            }),
            takeUntil(this._unsubscribeAll)
          )
          .toPromise()
          .then((res) => {
            return res;
          });

        this.districtResidencePlace.forEach((district) => {
          if (district.districtId == this.personal.address.districtId) {
            this.formInfoEdit
              .get('districtResidencePlace')
              .setValue(district.districtId);
          }
        });

        this.communeBirthPlace = await this._addressService
          .getCommune(this.personal.birthPlace.districtId)
          .pipe(
            map((res) => {
              const data = res.data.map((commune) => ({
                ...commune,
                communeDisplay: commune.communeType + ' ' + commune.communeName,
              }));
              return data;
            }),
            takeUntil(this._unsubscribeAll)
          )
          .toPromise()
          .then((res) => {
            return res;
          });

        this.communeBirthPlace.forEach((commune) => {
          if (commune.communeId == this.personal.birthPlace.communeId) {
            this.formInfoEdit
              .get('communeBirthPlace')
              .setValue(commune.communeId);
          }
        });

        // get list commune residen place
        this.communeResidencePlace = await this._addressService
          .getCommune(this.personal.address.districtId)
          .pipe(
            map((res) => {
              const data = res.data.map((commune) => ({
                ...commune,
                communeDisplay: commune.communeType + ' ' + commune.communeName,
              }));
              return data;
            }),
            takeUntil(this._unsubscribeAll)
          )
          .toPromise()
          .then((res) => {
            return res;
          });

        this.communeResidencePlace.forEach((commune) => {
          if (commune.communeId == this.personal.address.communeId) {
            this.formInfoEdit
              .get('communeResidencePlace')
              .setValue(commune.communeId);
          }
        });

        this.streetBirthPlace = await this._addressService
          .getStreet(this.personal.birthPlace.communeId)
          .pipe(
            map((res) => {
              const data = res.data.map((commune) => ({
                ...commune,
                communeDisplay: commune.streetType + ' ' + commune.streetName,
              }));
              console.log(data);
              return data;
            }),
            takeUntil(this._unsubscribeAll)
          )
          .toPromise()
          .then((res) => {
            return res;
          });

        this.streetResidencePlace = await this._addressService
          .getStreet(this.personal.address.communeId)
          .pipe(
            map((res) => {
              const data = res.data.map((commune) => ({
                ...commune,
                communeDisplay: commune.streetType + ' ' + commune.streetName,
              }));
              console.log(data);
              return data;
            }),
            takeUntil(this._unsubscribeAll)
          )
          .toPromise()
          .then((res) => {
            return res;
          });

        this.streetBirthPlace.forEach((street) => {
          if (street.streetId == this.personal.birthPlace.streetId) {
            this.formInfoEdit.get('streetBirthPlace').setValue(street.streetId);
          }
        });

        this.streetResidencePlace.forEach((street) => {
          if (street.streetId == this.personal.address.streetId) {
            this.formInfoEdit
              .get('streetResidencePlace')
              .setValue(street.streetId);
          }
        });
      }
    }
    // form danh sách chứng thư số
    this.formListSubscriberCertificate = this.fb.group({
      contains: [null],
      fromDate: [null],
      sort: [null],
      toDate: [null],
      page: [null],
      size: [this.sizePage[3]],
    });
    this.setPage({
      offset: 0,
      pageSize: this.formListSubscriberCertificate.get('size').value,
    });

    //form Danh sách yêu cầu chứng thực

    this.formListCertificateRequest = this.fb.group({
      contains: [null],
      fromDate: [null],
      sort: [null],
      toDate: [null],
      page: [null],
      size: [this.sizePage[3]],
    });
    this.setPageCRL({
      offset: 0,
      pageSize: this.formListSubscriberCertificate.get('size').value,
    });

    this.setPageCRL({
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
    this.newRequestForm = this.fb.group({
      cryptoAlgorithm: this.fb.group({
        cryptoSystem: [this.cryptoAlgorithm[0], Validators.required],
        keypairLength: [this.keypairLengthList[0], Validators.required],
      }),
      alias: [null, Validators.required, [this.checkAlias()]],
      tokenId: [this.tokenList[0], Validators.required],
      userId: [null],
      hsm: [this.hsmList[0]],
      profile: [null, Validators.required],
    });
  }
  // setPage danh sánh chứng thư số
  setPage(pageInfo) {
    console.log(pageInfo);
    this.isLoading = true;
    this.formListSubscriberCertificate.patchValue({ page: pageInfo.offset });
    this._subscriberCertificateService
      .getListSubscriberCertificates(
        JSON.stringify(this.formListSubscriberCertificate.value)
      )
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((pagedData) => {
        this.totalItems = pagedData.data.totalItems;
        this.pagedData = pagedData.data;
        this.rowsData = pagedData.data.data;
        this.isLoading = false;
      });
  }

  selectProvince(type) {
    switch (type) {
      case 2: {
        this.formInfoEdit.patchValue({
          districtResidencePlace: null,
          communeResidencePlace: null,
          streetResidencePlace: null,
          homeNumberResidencePlace: null,
        });
        this._addressService
          .getDistrict(this.formInfoEdit.get('provinceResidencePlace').value)
          .pipe(
            map((res) => {
              const data = res.data.map((district) => ({
                ...district,
                districtDisplay:
                  district.districtType + ' ' + district.districtName,
              }));
              return data;
            }),
            takeUntil(this._unsubscribeAll)
          )
          .subscribe((res) => {
            // console.log(res)
            this.districtResidencePlace = res;
            this.formInfoEdit.get('districtResidencePlace').enable();
          });
        break;
      }
      case 1: {
        this.formInfoEdit.patchValue({
          districtBirthPlace: null,
          communeBirthPlace: null,
          streetBirthPlace: null,
          homeNumberBirthPlace: null,
        });
        this._addressService
          .getDistrict(this.formInfoEdit.get('provinceBirthPlace').value)
          .pipe(
            map((res) => {
              const data = res.data.map((district) => ({
                ...district,
                districtDisplay:
                  district.districtType + ' ' + district.districtName,
              }));
              return data;
            }),
            takeUntil(this._unsubscribeAll)
          )
          .subscribe((res) => {
            this.districtBirthPlace = res;
            this.formInfoEdit.get('districtBirthPlace').enable();
          });
        break;
      }
    }
  }

  selectDistrict(type: number) {
    switch (type) {
      case 2: {
        this.formInfoEdit.patchValue({
          communeResidencePlace: null,
          streetResidencePlace: null,
          homeNumberResidencePlace: null,
        });
        this._addressService
          .getCommune(this.formInfoEdit.get('districtResidencePlace').value)
          .pipe(
            map((res) => {
              const data = res.data.map((commune) => ({
                ...commune,
                communeDisplay: commune.communeType + ' ' + commune.communeName,
              }));
              return data;
            }),
            takeUntil(this._unsubscribeAll)
          )
          .subscribe((res) => {
            this.communeResidencePlace = res;
            this.formInfoEdit.get('communeResidencePlace').enable();
          });
        break;
      }
      case 1:
        {
          this.formInfoEdit.patchValue({
            communeBirthPlace: null,
            streetBirthPlace: null,
            homeNumberBirthPlace: null,
          });
          this._addressService
            .getCommune(this.formInfoEdit.get('districtBirthPlace').value)
            .pipe(
              map((res) => {
                const data = res.data.map((commune) => ({
                  ...commune,
                  communeDisplay:
                    commune.communeType + ' ' + commune.communeName,
                }));
                return data;
              }),
              takeUntil(this._unsubscribeAll)
            )
            .subscribe((res) => {
              this.communeBirthPlace = res;
              this.formInfoEdit.get('communeBirthPlace').enable();
            });
        }
        break;
    }
  }
  selectCommune(type: number) {
    switch (type) {
      case 2: {
        this.formInfoEdit.patchValue({
          streetResidencePlace: null,
          homeNumberResidencePlace: null,
        });
        this._addressService
          .getStreet(this.formInfoEdit.get('communeResidencePlace').value)
          .pipe(
            map((res) => {
              const data = res.data.map((street) => ({
                ...street,
                streetDisplay: street.streetType + ' ' + street.streetName,
              }));
              return data;
            }),
            takeUntil(this._unsubscribeAll)
          )
          .subscribe((res) => {
            this.streetResidencePlace = res;
            this.formInfoEdit.get('streetResidencePlace').enable();
          });
        break;
      }
      case 1: {
        this.formInfoEdit.patchValue({
          streetBirthPlace: null,
          homeNumberBirthPlace: null,
        });
        this._addressService
          .getStreet(this.formInfoEdit.get('communeBirthPlace').value)
          .pipe(
            map((res) => {
              const data = res.data.map((street) => ({
                ...street,
                streetDisplay: street.streetType + ' ' + street.streetName,
              }));
              return data;
            }),
            takeUntil(this._unsubscribeAll)
          )
          .subscribe((res) => {
            this.streetBirthPlace = res;
            this.formInfoEdit.get('streetBirthPlace').enable();
          });
        break;
      }
    }
  }
  selectStreet(type: number) {
    switch (type) {
      case 2: {
        this.formInfoEdit.patchValue({
          homeNumberResidencePlace: null,
        });
        this.formInfoEdit.get('homeNumberResidencePlace').enable();
        break;
      }
      case 1: {
        this.formInfoEdit.patchValue({
          homeNumberBirthPlace: null,
        });
        this.formInfoEdit.get('homeNumberBirthPlace').enable();
        break;
      }
    }
  }

  modalOpenCreateStreet(modalSuccess) {
    this.modalService.open(modalSuccess, {
      centered: true,
      windowClass: 'modal modal-success',
    });
  }
  onSubmitCreateStreet(type, streetName) {
    switch (type) {
      case 1: {
        const communeId = this.formInfoEdit.get('communeResidencePlace').value;
        const body = {
          streetName: streetName,
          streetType: 'Đường',
          communeId: communeId,
        };
        this._addressService.createStreet(body).subscribe((res) => {
          this.streetResidencePlace = [...this.streetResidencePlace, res.data];
          if (
            this.formInfoEdit.get('communeBirthPlace').value != null &&
            communeId == this.formInfoEdit.get('communeBirthPlace').value
          ) {
            this.streetBirthPlace = [...this.streetBirthPlace, res.data];
          }
          this._toastrService.success(
            'Thêm thành công đường ' +
              res.data.streetName +
              'vào cơ sở dữ liệu',
            'Thành công',
            {
              positionClass: 'toast-top-center',
              toastClass: 'toast ngx-toastr',
              closeButton: true,
            }
          );
        });
        return true;
      }
      case 2: {
        const communeId = this.formInfoEdit.get('communeBirthPlace').value;
        const body = {
          streetName: streetName,
          streetType: 'Đường',
          communeId: communeId,
        };
        //Tạo dữ liệu đường mới lấy từ dữ liệu phường xã đã select
        this._addressService.createStreet(body).subscribe((res) => {
          //Cập nhật state do khi lưu dữ liệu lên server nhưng select không cập nhật dữ liệu mới
          this.streetBirthPlace = [...this.streetBirthPlace, res.data];
          if (
            this.formInfoEdit.get('communeResidencePlace').value != null &&
            communeId == this.formInfoEdit.get('communeResidencePlace').value
          ) {
            this.streetResidencePlace = [
              ...this.streetResidencePlace,
              res.data,
            ];
          }
          //Gửi thông báo thành công lên góc bên phải màn hình
          this._toastrService.success(
            'Thêm thành công đường ' +
              res.data.streetName +
              'vào cơ sở dữ liệu',
            'Thành công',
            {
              positionClass: 'toast-top-center',
              toastClass: 'toast ngx-toastr',
              closeButton: true,
            }
          );
        });
        return true;
      }
    }
  }
  get f() {
    return this.formInfoEdit.controls;
  }
  get fa() {
    return this.newRequestForm.controls;
  }
  uploadImage(e) {
    console.log(e);
  }
  inputImage(event) {
    if (typeof FileReader !== 'undefined') {
      const reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (e: any) => {
        this.image = e.target.result;
        console.log(this.image);
        console.log(this.image.split(',')[1]);
        this.formInfoEdit.patchValue({
          photo: this.image.split(',')[1],
        });
      };
    }
  }
  handleFileSelect(evt) {
    var files = evt.target.files;
    var file = files[0];
    console.log(files);
    console.log(file.name);
    this.handleReaderLoaded(file.name);
    // change base64
    // if (files && file) {
    //   var reader = new FileReader();

    //   reader.onload = this.handleReaderLoaded.bind(this);

    //   reader.readAsBinaryString(file);
    // }
  }

  handleReaderLoaded(fileName) {
    // var binaryString = readerEvt.target.result;
    // this.base64textString = btoa(binaryString);
    // console.log(btoa(binaryString));
    this.formUploadAvatar.get('avatar').setValue(fileName);
    console.log(this.formUploadAvatar.value);
    if (this.formUploadAvatar.invalid) {
      return;
    }
    this._usersService.updateAvatar(this.formUploadAvatar).subscribe(
      (res) => {
        console.log(res.result);
        if (res.result === true) {
          this.toastr.success('👋 Thay avatar thành công', 'Thành công', {
            positionClass: 'toast-top-center',
            toastClass: 'toast ngx-toastr',
            closeButton: true,
          });
          this.modalRef.close();
        } else {
          this.toastr.error('👋Thay avatar', 'Thất bại', {
            positionClass: 'toast-top-center',
            toastClass: 'toast ngx-toastr',
            closeButton: true,
          });
        }
      },
      (error) => {
        alert('File ảnh không khả dụng');
        return false;
      }
    );
  }
  // async loadProfile() {
  //   console.log('Loading');
  //   // keyCheck
  //   // const keyCheck = false;
  //   // console.log(this.formInfoEdit.value)
  //   if (this.formInfoEdit.value.userId == null) {
  //     this.organizationId = await this._organizationListService
  //       .getAllOrganizations()
  //       .pipe(takeUntil(this._unsubscribeAll))
  //       .toPromise()
  //       .then((res) => {
  //         console.log(res.data);

  //         return res.data;
  //       });

  //     this.provinceBirthPlace = this.provinceResidencePlace =
  //       await this._addressService
  //         .getProvince()
  //         .pipe(
  //           map((res) => {
  //             const data = res.data.map((city) => ({
  //               ...city,
  //               provinceDisplay: city.provinceType + ' ' + city.provinceName,
  //             }));
  //             return data;
  //           }),
  //           takeUntil(this._unsubscribeAll)
  //         )
  //         .toPromise()
  //         .then((res) => {
  //           return res;
  //         });

  //     if (this._authenticationService.isStaff) {
  //       this.personal = await this._usersService
  //         .getStaffSelf()
  //         .pipe(takeUntil(this._unsubscribeAll))
  //         .toPromise()
  //         .then((res) => {
  //           return res.data;
  //         });

  //       this.formInfoEdit.patchValue({
  //         userId: this.personal.userId,
  //         username: this.personal.username,
  //         firstName: this.personal.firstName,
  //         middleName: this.personal.middleName,
  //         lastName: this.personal.lastName,
  //         phoneNumber: this.personal.phoneNumber,
  //         personalCountryId: this.personal.personalCountryId,
  //         birthday: this.personal.birthday,
  //         gender: this.personal.gender,
  //         email: this.personal.email,
  //         homeNumberBirthPlace: this.personal.birthPlace.houseNumber,
  //         homeNumberResidencePlace: this.personal.address.houseNumber,
  //       });

  //       this.organizationId.forEach((organization) => {
  //         if (organization.organizationName == this.personal.organizationName) {
  //           this.formInfoEdit
  //             .get('organizationId')
  //             .setValue(organization.organizationId);
  //         }
  //       });

  //       // set province birth place
  //       this.provinceBirthPlace.forEach((province) => {
  //         if (province.provinceId == this.personal.birthPlace.provinceId) {
  //           this.formInfoEdit
  //             .get('provinceBirthPlace')
  //             .setValue(province.provinceId);
  //         }
  //       });

  //       this.provinceResidencePlace.forEach((province) => {
  //         if (province.provinceId == this.personal.address.provinceId) {
  //           this.formInfoEdit
  //             .get('provinceResidencePlace')
  //             .setValue(province.provinceId);
  //         }
  //       });

  //       // get list district birth place
  //       this.districtBirthPlace = await this._addressService
  //         .getDistrict(this.personal.birthPlace.provinceId)
  //         .pipe(
  //           map((res) => {
  //             const data = res.data.map((district) => ({
  //               ...district,
  //               districtDisplay:
  //                 district.districtType + ' ' + district.districtName,
  //             }));
  //             return data;
  //           }),
  //           takeUntil(this._unsubscribeAll)
  //         )
  //         .toPromise()
  //         .then((res) => {
  //           return res;
  //         });

  //       this.districtBirthPlace.forEach((district) => {
  //         if (district.districtId == this.personal.birthPlace.districtId) {
  //           this.formInfoEdit
  //             .get('districtBirthPlace')
  //             .setValue(district.districtId);
  //         }
  //       });

  //       // get list district resident place
  //       this.districtResidencePlace = await this._addressService
  //         .getDistrict(this.personal.address.provinceId)
  //         .pipe(
  //           map((res) => {
  //             const data = res.data.map((district) => ({
  //               ...district,
  //               districtDisplay:
  //                 district.districtType + ' ' + district.districtName,
  //             }));
  //             return data;
  //           }),
  //           takeUntil(this._unsubscribeAll)
  //         )
  //         .toPromise()
  //         .then((res) => {
  //           return res;
  //         });

  //       this.districtResidencePlace.forEach((district) => {
  //         if (district.districtId == this.personal.address.districtId) {
  //           this.formInfoEdit
  //             .get('districtResidencePlace')
  //             .setValue(district.districtId);
  //         }
  //       });

  //       this.communeBirthPlace = await this._addressService
  //         .getCommune(this.personal.birthPlace.districtId)
  //         .pipe(
  //           map((res) => {
  //             const data = res.data.map((commune) => ({
  //               ...commune,
  //               communeDisplay: commune.communeType + ' ' + commune.communeName,
  //             }));
  //             return data;
  //           }),
  //           takeUntil(this._unsubscribeAll)
  //         )
  //         .toPromise()
  //         .then((res) => {
  //           return res;
  //         });

  //       this.communeBirthPlace.forEach((commune) => {
  //         if (commune.communeId == this.personal.birthPlace.communeId) {
  //           this.formInfoEdit
  //             .get('communeBirthPlace')
  //             .setValue(commune.communeId);
  //         }
  //       });

  //       // get list commune residen place
  //       this.communeResidencePlace = await this._addressService
  //         .getCommune(this.personal.address.districtId)
  //         .pipe(
  //           map((res) => {
  //             const data = res.data.map((commune) => ({
  //               ...commune,
  //               communeDisplay: commune.communeType + ' ' + commune.communeName,
  //             }));
  //             return data;
  //           }),
  //           takeUntil(this._unsubscribeAll)
  //         )
  //         .toPromise()
  //         .then((res) => {
  //           return res;
  //         });

  //       this.communeResidencePlace.forEach((commune) => {
  //         if (commune.communeId == this.personal.address.communeId) {
  //           this.formInfoEdit
  //             .get('communeResidencePlace')
  //             .setValue(commune.communeId);
  //         }
  //       });

  //       this.streetBirthPlace = await this._addressService
  //         .getStreet(this.personal.birthPlace.communeId)
  //         .pipe(
  //           map((res) => {
  //             const data = res.data.map((commune) => ({
  //               ...commune,
  //               communeDisplay: commune.streetType + ' ' + commune.streetName,
  //             }));
  //             console.log(data);
  //             return data;
  //           }),
  //           takeUntil(this._unsubscribeAll)
  //         )
  //         .toPromise()
  //         .then((res) => {
  //           return res;
  //         });

  //       this.streetResidencePlace = await this._addressService
  //         .getStreet(this.personal.address.communeId)
  //         .pipe(
  //           map((res) => {
  //             const data = res.data.map((commune) => ({
  //               ...commune,
  //               communeDisplay: commune.streetType + ' ' + commune.streetName,
  //             }));
  //             console.log(data);
  //             return data;
  //           }),
  //           takeUntil(this._unsubscribeAll)
  //         )
  //         .toPromise()
  //         .then((res) => {
  //           return res;
  //         });

  //       this.streetBirthPlace.forEach((street) => {
  //         if (street.streetId == this.personal.birthPlace.streetId) {
  //           this.formInfoEdit.get('streetBirthPlace').setValue(street.streetId);
  //         }
  //       });

  //       this.streetResidencePlace.forEach((street) => {
  //         if (street.streetId == this.personal.address.streetId) {
  //           this.formInfoEdit
  //             .get('streetResidencePlace')
  //             .setValue(street.streetId);
  //         }
  //       });
  //     }
  //   }
  // }

  async updateRole() {
    const adminRole = Object.values(this.formRoleEdit.value.adminRole).filter(
      (f) => f
    );
    const superAdminRole = Object.values(
      this.formRoleEdit.value.superAdminRole
    ).filter((f) => f);
    const userRole = Object.values(this.formRoleEdit.value.userRole).filter(
      (f) => f
    );
    if (adminRole.length > 0) {
      this.roleArray.push('ROLE_ADMIN');
    }
    if (superAdminRole.length > 0) {
      this.roleArray.push('ROLE_SUPER_ADMIN');
    }
    if (userRole.length > 0) {
      this.roleArray.push('ROLE_USER');
    }
    console.log(this.roleArray);
    this.formUpdateRole.patchValue({
      username: this.personal.username,
      roles: this.roleArray,
    });
    await this._usersService
      .updateRole(JSON.stringify(this.formUpdateRole.value))
      .pipe(takeUntil(this._unsubscribeAll))
      .toPromise()
      .then((res) => {
        //console.log(res);
        if (res.result == false) {
          throw new Error(res.message);
        }
        return res;
      });
    this.roleArray = [];
    this.getRole();
  }
  getRole() {
    this._usersService
      .getRole(this.personal.username)
      .pipe(takeUntil(this._unsubscribeAll))
      .toPromise()
      .then((res) => {
        console.log(res.data);
        this.getRoles = res.data;
        if (res.result == false) {
          throw new Error(res.message);
        }

        return res;
      });
    //load lại checkbox
    setTimeout(() => {
      // <<<---using ()=> syntax
      console.log(this.getRoles);
      for (let i = 0; i < this.getRoles.length; i++) {
        if (this.getRoles[i] === 'USER') {
          this.formRoleEdit.patchValue({
            userRole: {
              hasRead: true,
              hasWrite: false,
              hasCreate: false,
              hasDelete: false,
            },
          });
        }
        if (this.getRoles[i] === 'SUPER_ADMIN') {
          this.formRoleEdit.patchValue({
            superAdminRole: {
              hasRead: true,
              hasWrite: false,
              hasCreate: false,
              hasDelete: false,
            },
          });
        }
        if (this.getRoles[i] === 'ADMIN') {
          this.formRoleEdit.patchValue({
            adminRole: {
              hasRead: true,
              hasWrite: false,
              hasCreate: false,
              hasDelete: false,
            },
          });
        }
      }
    }, 500);
  }
  onSubmit() {
    if (!this.formInfoEdit.valid) {
      console.log(this.formInfoEdit.value);
      console.log('??');
      this.submitted = true;
      return;
    }
    console.log(this.formInfoEdit.valid);
    this.confirmOpen();
  }
  confirmOpen() {
    Swal.fire({
      title: 'Bạn có chắc muốn cập nhật?',
      text: 'Bạn sẽ không thể hoàn tác điều này!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#7367F0',
      preConfirm: async () => {
        return await this._usersService
          .updateSelfStaff(JSON.stringify(this.formInfoEdit.value))
          .pipe(takeUntil(this._unsubscribeAll))
          .toPromise()
          .then((res) => {
            if (res.result == false) {
              throw new Error(res.message);
            }
            return res;
          })
          .catch(function (error) {
            Swal.showValidationMessage('Mã lỗi:  ' + error + '');
          });
      },
      cancelButtonColor: '#E42728',
      cancelButtonText: 'Thoát',
      confirmButtonText: 'Đúng, tôi muốn cập nhật!',
      customClass: {
        confirmButton: 'btn btn-primary',
        cancelButton: 'btn btn-danger ml-1',
      },
      allowOutsideClick: () => {
        return !Swal.isLoading();
      },
    }).then(function (result) {
      if (result.value) {
        Swal.fire({
          icon: 'success',
          title: 'Thành công!',
          text: 'Thông tin tài khoản đã được cập nhật.',
          customClass: {
            confirmButton: 'btn btn-success',
          },
        });
      }
    });
  }

  customCheckboxOnSelect({ selected }) {
    this.chkBoxSelected.splice(0, this.chkBoxSelected.length);
    this.chkBoxSelected.push(...selected);
  }
  onSelect({ selected }) {
    console.log('Select Event', selected, this.selected);
    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
    this.formInfoEdit.get('userId').setValue(this.personal.userId);
    console.log(this.personal.userId);
  }

  //Danh sách yêu cầu chứng thực
  getOrganizationCRL(item): any {
    console.log(item);
    let info = this._listCerReqService.readCertificate(
      item.certificateRequestContent
    );
    console.log(typeof info.subjectName.asn[4]);
    console.log(JSON.stringify(info.subjectName.asn[4]));
    this.test = info.subjectName.asn[4];
    console.log(this.test);
    console.log(info.subjectName.asn.find((obj) => obj.type === '2.5.4.11'));
    let rs = info.find((obj) => obj.name === 'organizationalUnitName');
    if (rs == undefined) return;
    return rs.value;
  }
  getSubscribe(item): any {
    let info = this._listCerReqService.readCertificate(
      item.certificateRequestContent
    );
    return info.find((obj) => obj.name === 'commonName').value;
  }
  setPageCRL(pageInfo) {
    this.isLoading = true;
    this.formListCertificateRequest.patchValue({ page: pageInfo.offset });
    this._listCerReqService
      .getListCertificateRequests(
        JSON.stringify(this.formListCertificateRequest.value)
      )
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((pagedDataCRL) => {
        console.log(pagedDataCRL);
        this.totalItems = pagedDataCRL.data.totalItems;
        this.pagedDataCRL = pagedDataCRL.data;
        this.rowsDataCRL = pagedDataCRL.data.data;
        this.rowsDataCRL = pagedDataCRL.data.data.map((item) => ({
          ...item,
          // organizationName: this.getOrganizationCRL(item),
          // subscribeName: this.getSubscribe(item),
        }));
        this.isLoading = false;
      });
  }

  // open modal chứng thư số
  openNewCertModal(modal) {
    this.rowDataSelected = this.selected;
    this.formUploadCert.reset();
    this.modalRef = this.modalService.open(modal, {
      centered: true,
      size: 'lg',
    });
  }

  // open modal yêu cầu chứng thực
  openToggleSidebar(modalForm) {
    this.modal.open(modalForm, { size: 'xl' });
  }

  checkAlias(): AsyncValidatorFn {
    return (
      control: AbstractControl
    ): Observable<{ [key: string]: any } | null> => {
      return this._addressService.checkAlias(control.value).pipe(
        map((res) => {
          if (res.data) {
            return { used: true };
          } else {
            return null;
          }
        })
      );
    };
  }

  changeProfile() {
    const profile: any[] = this.fa.profile.value.subjectDNA;
    this.strProfile = '';
    let firstWord = true;
    profile.map((attribute: string) => {
      let value = '';
      switch (attribute) {
        case 'CN':
          value =
            this.personal.firstName +
            ' ' +
            this.personal.middleName +
            ' ' +
            this.personal.lastName;
          this.displayProfile(attribute, value, firstWord);
          firstWord = false;
          break;
        case 'GIVENNAME':
          value = this.personal.firstName + ' ' + this.personal.middleName;
          this.displayProfile(attribute, value, firstWord);
          firstWord = false;
          break;
        case 'SURNAME':
          value = this.personal.firstName;
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
          value = this.personal.organizationName;
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
  toggleSidebar() {
    this.modal.dismissAll();
  }
}
