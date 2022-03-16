import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { Router } from '@angular/router';
import { CoreConfigService } from '@core/services/config.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { User } from 'app/auth/models';
import { AuthenticationService } from 'app/auth/service';
import { Province, District, Commune, Street } from 'app/main/models/Address';
import { Personal } from 'app/main/models/Personal';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { AddressService } from '../../address.service';
import { OrganizationListService } from '../../subscribers/organizations/organization-list/organization-list.service';
import { PersonalService } from '../../subscribers/personals/personal.service';

@Component({
  selector: 'app-create-self',
  templateUrl: './create-self.component.html',
  styleUrls: ['./create-self.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CreateSelfComponent implements OnInit {
  /** @Private */
  private _unsubscribeAll = new Subject();
  private personal: Personal;
  /** @public */
  coreConfig: any;
  public submitted = false;
  public spinner = false;
  public lastValue;
  public url = this.router.url;
  public display = 'none'; //default Variable
  /**@form */
  public newPersonal: FormGroup;
  public buttonReturn: object;
  public email;
  public image = '';
  public currentUser: User;
  //BirthPlace
  public countryBirthPlace: any[] = [
    {
      countryId: 237,
      countryName: 'Việt Nam',
      countryCode: 'VN',
      countryType: 'Independent State',
    },
  ];
  provinceBirthPlace: Province[];
  districtBirthPlace: District[];
  communeBirthPlace: Commune[];
  streetBirthPlace: Street[];

  //ResidencePlace
  public countryResidencePlace: [any] = [
    {
      countryId: 237,
      countryName: 'Việt Nam',
      countryCode: 'VN',
      countryType: 'Independent State',
    },
  ];
  public provinceResidencePlace: Province[];
  public districtResidencePlace: District[];
  public communeResidencePlace: Commune[];
  public streetResidencePlace: Street[];
  public organizationId: any[] = [];
  public checkSubmit: boolean = false;
  public checkStreet = false;
  gender: any[] = ['Nam', 'Nữ'];

  /**
   * Constructor
   *
   * @param {CoreConfigService} _coreConfigService
   */
  constructor(
    private _coreConfigService: CoreConfigService,
    private fb: FormBuilder,
    private router: Router,
    private modalService: NgbModal,
    private _addressService: AddressService,
    private _router: Router,
    private _toastrService: ToastrService,
    private _organizationListService: OrganizationListService,
    private dateAdapter: DateAdapter<any>,
    private _personalService: PersonalService,
    private _authenticationService: AuthenticationService
  ) {
    this.buttonReturn = {
      breadcrumbs: {
        links: [
          {
            name: 'Quay lại',
            isLink: true,
            link: '/pages/authentication/authentication/login',
          },
        ],
      },
    };
    this._unsubscribeAll = new Subject();
    this.newPersonal = this.fb.group({
      subscriberCategoryId: ['1', [Validators.required]],
      firstName: [null, [Validators.required]],
      middleName: [null, [Validators.required]],
      lastName: [null, [Validators.required]],
      phoneNumber: [
        null,
        [
          Validators.required,
          Validators.minLength(10),
          Validators.pattern(/(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/),
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
      organizationId: [0],
      streetBirthPlace: [{ value: null, disabled: true }, Validators.required],
      countryBirthPlace: [
        this.countryBirthPlace[0].countryId,
        Validators.required,
      ],
      provinceBirthPlace: [null, Validators.required],
      districtBirthPlace: [
        { value: null, disabled: true },
        Validators.required,
      ],
      communeBirthPlace: [{ value: null, disabled: true }, Validators.required],
      homeNumberBirthPlace: [
        { value: null, disabled: true },
        Validators.required,
      ],
      countryResidencePlace: [
        this.countryResidencePlace[0].countryId,
        Validators.required,
      ],
      provinceResidencePlace: [null, Validators.required],
      districtResidencePlace: [
        { value: null, disabled: true },
        Validators.required,
      ],
      communeResidencePlace: [
        { value: null, disabled: true },
        Validators.required,
      ],
      streetResidencePlace: [
        { value: null, disabled: true },
        Validators.required,
      ],
      homeNumberResidencePlace: [
        { value: null, disabled: true },
        Validators.required,
      ],
      gender: [this.gender[0], [Validators.required]],
      birthday: [null, [Validators.required, Validators.minLength(22)]],
    });
    this.lastValue = this.url.substr(this.url.lastIndexOf('/') + 1);
    // Configure the layout
    this._coreConfigService.config = {
      layout: {
        navbar: {
          hidden: true,
        },
        footer: {
          hidden: true,
        },
        menu: {
          hidden: true,
        },
        customizer: false,
        enableLocalStorage: false,
      },
    };
  }

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  async ngOnInit(): Promise<void> {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    console.log(this.currentUser);
    // Subscribe to config changes
    this._coreConfigService.config
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((config) => {
        this.coreConfig = config;
      });

    this.provinceBirthPlace = this.provinceResidencePlace =
      await this._addressService
        .getProvince()
        .pipe(
          map((res) => {
            console.log(res);
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
    this.organizationId = await this._organizationListService
      .searchOrganizations({
        page: null,
        size: null,
        sort: [],
        contains: '',
        fromDate: '',
        toDate: '',
      })
      .pipe(takeUntil(this._unsubscribeAll))
      .toPromise()
      .then((res) => {
        return res.data.data;
      });
    //   this._personalService.getPersonal().subscribe((res) => {
    //     console.log(res);
    //   });
    this.getAllOrganization();
  }

  get f() {
    return this.newPersonal.controls;
  }
  inputImage(event) {
    if (typeof FileReader !== 'undefined') {
      const reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (e: any) => {
        this.image = e.target.result;
        console.log(this.image);
        console.log(this.image.split(',')[1]);
        this.newPersonal.patchValue({
          photo: this.image.split(',')[1],
        });
      };
    }
  }

  getAllOrganization() {
    this._personalService.getOrganizationId().subscribe((res) => {
      this.organizationId = res.data;
      console.log(res);
      console.log(this.organizationId);
    });
  }

  selectOrganization(e) {
    this.newPersonal.controls['organizationId'].setValue(e.organizationId);
  }

  onSubmit() {
    console.log(this.newPersonal.value);
    this.submitted = true;
    // stop here if form is invalid
    if (this.newPersonal.invalid) {
      return;
    }
    this.confirmOpen();
  }

  async confirmOpen() {
    var check = false;
    await Swal.fire({
      title: 'Bạn có chắc muốn cập nhật?',
      text: 'Bạn sẽ không thể hoàn tác điều này!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#7367F0',
      preConfirm: async () => {
        return await this._personalService
          .createPersonalSelf(JSON.stringify(this.newPersonal.value))
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
          timer: 3000,
          text: 'Thông tin tài khoản đã được cập nhật.',
          customClass: {
            confirmButton: 'btn btn-success',
          },
        });
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        console.log(result);

        currentUser.isSetSubscriber = true;
        currentUser.firstName = result.value.data.firstName;
        currentUser.middleName = result.value.data.middleName;
        currentUser.lastName = result.value.data.lastName;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        console.log(currentUser);
        check = true;
      }
    });
    // .then(function () {
    //   console.log('okokok');
    //   window.location.href = this._router.navigate(['/apps/dashboard']);
    // });
    console.log(check);
    if (check) {
      this._router.navigate(['/apps/dashboard']);
    }
  }

  selectProvince(type) {
    switch (type) {
      case 2: {
        this.newPersonal.patchValue({
          districtResidencePlace: null,
          communeResidencePlace: null,
          streetResidencePlace: null,
          homeNumberResidencePlace: null,
        });
        this._addressService
          .getDistrict(this.newPersonal.get('provinceResidencePlace').value)
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
            this.newPersonal.get('districtResidencePlace').enable();
          });
        break;
      }
      case 1: {
        this.newPersonal.patchValue({
          districtBirthPlace: null,
          communeBirthPlace: null,
          streetBirthPlace: null,
          homeNumberBirthPlace: null,
        });
        this._addressService
          .getDistrict(this.newPersonal.get('provinceBirthPlace').value)
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
            this.newPersonal.get('districtBirthPlace').enable();
          });
        break;
      }
    }
  }

  selectDistrict(type: number) {
    switch (type) {
      case 2: {
        this.newPersonal.patchValue({
          communeResidencePlace: null,
          streetResidencePlace: null,
          homeNumberResidencePlace: null,
        });
        this._addressService
          .getCommune(this.newPersonal.get('districtResidencePlace').value)
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
            this.newPersonal.get('communeResidencePlace').enable();
          });
        break;
      }
      case 1:
        {
          this.newPersonal.patchValue({
            communeBirthPlace: null,
            streetBirthPlace: null,
            homeNumberBirthPlace: null,
          });
          this._addressService
            .getCommune(this.newPersonal.get('districtBirthPlace').value)
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
              this.newPersonal.get('communeBirthPlace').enable();
            });
        }
        break;
    }
  }
  selectCommune(type: number) {
    switch (type) {
      case 2: {
        this.newPersonal.patchValue({
          streetResidencePlace: null,
          homeNumberResidencePlace: null,
        });
        this._addressService
          .getStreet(this.newPersonal.get('communeResidencePlace').value)
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
            this.newPersonal.get('streetResidencePlace').enable();
          });
        break;
      }
      case 1: {
        this.newPersonal.patchValue({
          streetBirthPlace: null,
          homeNumberBirthPlace: null,
        });
        this._addressService
          .getStreet(this.newPersonal.get('communeBirthPlace').value)
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
            this.newPersonal.get('streetBirthPlace').enable();
          });
        break;
      }
    }
  }
  selectStreet(type: number) {
    switch (type) {
      case 2: {
        this.newPersonal.patchValue({
          homeNumberResidencePlace: null,
        });
        this.newPersonal.get('homeNumberResidencePlace').enable();
        break;
      }
      case 1: {
        if(this.checkStreet === false){
          this.newPersonal.get('homeNumberResidencePlace').enable();
          this.checkStreet = true;
        }
        this.newPersonal.patchValue({
          homeNumberBirthPlace: null,
        });
        this.newPersonal.get('homeNumberBirthPlace').enable();
        break;
      }
    }
  }

  getHomeBirthDay(event) {
    console.log(event.target.value);
    this.newPersonal
      .get('homeNumberResidencePlace')
      .setValue(this.newPersonal.get('homeNumberBirthPlace').value);
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
        const communeId = this.newPersonal.get('communeResidencePlace').value;
        const body = {
          streetName: streetName,
          streetType: 'Đường',
          communeId: communeId,
        };
        this._addressService.createStreet(body).subscribe((res) => {
          this.streetResidencePlace = [...this.streetResidencePlace, res.data];
          if (
            this.newPersonal.get('communeBirthPlace').value != null &&
            communeId == this.newPersonal.get('communeBirthPlace').value
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
        const communeId = this.newPersonal.get('communeBirthPlace').value;
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
            this.newPersonal.get('communeResidencePlace').value != null &&
            communeId == this.newPersonal.get('communeResidencePlace').value
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

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
