import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Province, District, Commune, Street } from 'app/main/models/Address';
import { Organization } from 'app/main/models/Organization';
import { Personal } from 'app/main/models/Personal';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { AddressService } from '../../../address.service';
import { OrganizationListService } from '../../organizations/organization-list/organization-list.service';
import { PersonalService } from '../personal.service';

@Component({
  selector: 'app-personal-edit',
  templateUrl: './personal-edit.component.html',
  styleUrls: ['./personal-edit.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class PersonalEditComponent implements OnInit {
  private _unsubscribeAll = new Subject();
  private personal: Personal;
  public buttonReturn: object;
  formPersonalEdit: FormGroup;
  formRoleEdit: FormGroup;
  formUpdateRole: FormGroup;
  roleArray: any[] = [];
  public contentHeader: object;
  public url = this.router.url;
  public lastValue;
  public getRoles;
  public image = '';
  public body = {
    page: null,
    size: null,
    sort: [],
    contains: '',
    fromDate: '',
    toDate: '',
  };
  submitted = false;

  public organizationId: Organization[];
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
  gender: string[] = ['Nam', 'Nữ'];
  private readonly currentUser = JSON.parse(
    localStorage.getItem('currentUser')
  );
  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private _personalService: PersonalService,
    private _organizationListService: OrganizationListService,
    private _addressService: AddressService,
    private modalService: NgbModal,
    private _toastrService: ToastrService,
    private route: ActivatedRoute,
  ) {
    this.contentHeader = {
      headerTitle: 'Thuê Bao',
      actionButton: true,
      breadcrumb: {
        type: 'chevron',
        links: [
          {
            name: 'Quản lý thuê bao',
            isLink: true,
            link: '/apps/ip/subscribers-list',
          },
          {
            name: 'Chỉnh sửa thuê bao',
            isLink: false,
            link: '/apps/ip/subscribers-search',
          },
        ],
      },
    };

    this.buttonReturn = {
      breadcrumbs: {
        links: [
          {
            name: 'Quay lại',
            isLink: true,
            link: '/apps/ip/subscribers-list',
          },
        ],
      },
    };

    // this._unsubscribeAll = new Subject();
    this.lastValue = this.url.substr(this.url.lastIndexOf('/') + 1);

    this.formRoleEdit = this.formBuilder.group({
      adminRole: this.formBuilder.group({
        hasRead: true,
        hasWrite: false,
        hasCreate: true,
        hasDelete: false,
      }),
      superAdminRole: this.formBuilder.group({
        hasRead: true,
        hasWrite: false,
        hasCreate: false,
        hasDelete: false,
      }),
      userRole: this.formBuilder.group({
        hasRead: false,
        hasWrite: true,
        hasCreate: false,
        hasDelete: true,
      }),
    });
    this.formUpdateRole = this.formBuilder.group({
      username: [''],
      roles: [[]],
    });
    this.formPersonalEdit = this.formBuilder.group({
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
          Validators.pattern(/(01|03|05|07|08|09|02[0|1|2|3|4|5|6|7|8|9])+([0-9]{8})\b/),
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
    });
  }

  async ngOnInit() {
    // this.getPersonalDetail();
    this.contentHeader = {
      headerTitle: 'Thuê Bao',
      actionButton: true,
      breadcrumb: {
        type: 'chevron',
        links: [
          {
            name: 'Quản lý thuê bao',
            isLink: true,
            link: '/apps/ip/subscribers-list',
          },
          {
            name: 'Chỉnh sửa thuê bao',
            isLink: false,
            link: '/apps/ip/subscribers-search',
          },
        ],
      },
    };

    // get organizationID
    // this.organizationId = await this._organizationListService
    //   .searchOrganizations(this.body)
    //   .pipe(takeUntil(this._unsubscribeAll))
    //   .toPromise()
    //   .then((res) => {
    //     console.log(res);
    //     return res.data.data;
    //   });
    this.organizationId = await this._organizationListService
      .getAllOrganizations()
      .pipe(takeUntil(this._unsubscribeAll))
      .toPromise()
      .then((res) => {
        console.log(res);
        console.log(res.data);
        return res.data;
      });

    this.personal = await this._personalService
      .getPersonalById(this.lastValue)
      .pipe(takeUntil(this._unsubscribeAll))
      .toPromise()
      .then((res) => {
        return res.data;
      });
    console.log(this.personal);
    this.formPersonalEdit.patchValue({
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
        this.formPersonalEdit
          .get('organizationId')
          .setValue(organization.organizationId);
      }
    });
    // end get organizationId

    // set provice
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

    // set province birth place
    this.provinceBirthPlace.forEach((province) => {
      if (province.provinceId == this.personal.birthPlace.provinceId) {
        this.formPersonalEdit
          .get('provinceBirthPlace')
          .setValue(province.provinceId);
      }
    });

    this.provinceResidencePlace.forEach((province) => {
      if (province.provinceId == this.personal.address.provinceId) {
        this.formPersonalEdit
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
        this.formPersonalEdit
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
        this.formPersonalEdit
          .get('districtResidencePlace')
          .setValue(district.districtId);
      }
    });
    // get list commune addresss

    this.communeBirthPlace = await this._addressService
      .getCommune(this.personal.birthPlace.districtId)
      .pipe(
        map((res) => {
          const data = res.data.map((commune) => ({
            ...commune,
            communeDisplay: commune.communeType + ' ' + commune.communeName,
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

    this.communeBirthPlace.forEach((commune) => {
      if (commune.communeId == this.personal.birthPlace.communeId) {
        this.formPersonalEdit
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
        this.formPersonalEdit
          .get('communeResidencePlace')
          .setValue(commune.communeId);
      }
    });
    // get list street
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
        this.formPersonalEdit.get('streetBirthPlace').setValue(street.streetId);
      }
    });

    this.streetResidencePlace.forEach((street) => {
      if (street.streetId == this.personal.address.streetId) {
        this.formPersonalEdit
          .get('streetResidencePlace')
          .setValue(street.streetId);
      }
    });
  }

  selectProvince(type) {
    switch (type) {
      case 2: {
        this.formPersonalEdit.patchValue({
          districtResidencePlace: null,
          communeResidencePlace: null,
          streetResidencePlace: null,
          homeNumberResidencePlace: null,
        });
        this._addressService
          .getDistrict(
            this.formPersonalEdit.get('provinceResidencePlace').value
          )
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
            this.formPersonalEdit.get('districtResidencePlace').enable();
          });
        break;
      }
      case 1: {
        this.formPersonalEdit.patchValue({
          districtBirthPlace: null,
          communeBirthPlace: null,
          streetBirthPlace: null,
          homeNumberBirthPlace: null,
        });
        this._addressService
          .getDistrict(this.formPersonalEdit.get('provinceBirthPlace').value)
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
            this.formPersonalEdit.get('districtBirthPlace').enable();
          });
        break;
      }
    }
  }

  selectDistrict(type: number) {
    switch (type) {
      case 2: {
        this.formPersonalEdit.patchValue({
          communeResidencePlace: null,
          streetResidencePlace: null,
          homeNumberResidencePlace: null,
        });
        this._addressService
          .getCommune(this.formPersonalEdit.get('districtResidencePlace').value)
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
            this.formPersonalEdit.get('communeResidencePlace').enable();
          });
        break;
      }
      case 1:
        {
          this.formPersonalEdit.patchValue({
            communeBirthPlace: null,
            streetBirthPlace: null,
            homeNumberBirthPlace: null,
          });
          this._addressService
            .getCommune(this.formPersonalEdit.get('districtBirthPlace').value)
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
              this.formPersonalEdit.get('communeBirthPlace').enable();
            });
        }
        break;
    }
  }
  selectCommune(type: number) {
    switch (type) {
      case 2: {
        this.formPersonalEdit.patchValue({
          streetResidencePlace: null,
          homeNumberResidencePlace: null,
        });
        this._addressService
          .getStreet(this.formPersonalEdit.get('communeResidencePlace').value)
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
            this.formPersonalEdit.get('streetResidencePlace').enable();
          });
        break;
      }
      case 1: {
        this.formPersonalEdit.patchValue({
          streetBirthPlace: null,
          homeNumberBirthPlace: null,
        });
        this._addressService
          .getStreet(this.formPersonalEdit.get('communeBirthPlace').value)
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
            this.formPersonalEdit.get('streetBirthPlace').enable();
          });
        break;
      }
    }
  }
  selectStreet(type: number) {
    switch (type) {
      case 2: {
        this.formPersonalEdit.patchValue({
          homeNumberResidencePlace: null,
        });
        this.formPersonalEdit.get('homeNumberResidencePlace').enable();
        break;
      }
      case 1: {
        this.formPersonalEdit.patchValue({
          homeNumberBirthPlace: null,
        });
        this.formPersonalEdit.get('homeNumberBirthPlace').enable();
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
  onSubmitCreateProvince(type,provinceName){
    switch (type) {
      case 1: {
        const countryId = this.formPersonalEdit.get('countryResidencePlace').value;
        const body = {
          provinceName: provinceName,
          provinceType: 'Tỉnh/Thành phố',
          countryId: countryId,
        };
        this._addressService.createProvince(body).subscribe((res) => {
          this.provinceResidencePlace = [...this.provinceResidencePlace, res.data];
          if (
            this.formPersonalEdit.get('countryResidencePlace').value != null &&
            countryId == this.formPersonalEdit.get('countryResidencePlace').value
          ) {
            this.provinceBirthPlace = [...this.provinceBirthPlace, res.data];
          }
          this._toastrService.success(
            'Thêm thành công Tỉnh/Thành phố ' +
              res.data.provinceName +
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
        const countryId = this.formPersonalEdit.get('countryBirthPlace').value;
        const body = {
          provinceName: provinceName,
          provinceType: 'Tỉnh/Thành phố',
          countryId: countryId,
        };
        //Tạo dữ liệu Tỉnh/Thành phố mới - lấy từ dữ liệu Quốc gia đã select
        this._addressService.createProvince(body).subscribe((res) => {
          //Cập nhật state do khi lưu dữ liệu lên server nhưng select không cập nhật dữ liệu mới
          this.provinceBirthPlace = [...this.provinceBirthPlace, res.data];
          this.provinceResidencePlace = [...this.provinceResidencePlace, res.data];
          if (
            this.formPersonalEdit.get('countryResidencePlace').value != null &&
            countryId == this.formPersonalEdit.get('countryResidencePlace').value
          ) {
            this.provinceResidencePlace = [
              ...this.provinceResidencePlace,
              res.data,
            ];
          }
          //Gửi thông báo thành công lên góc bên phải màn hình
          this._toastrService.success(
            'Thêm thành công Tỉnh/Thành phố' +
              res.data.provinceName +
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
  onSubmitCreateDistrict(type,districtName) {
    switch (type) {
      case 1: {
        const provinceId = this.formPersonalEdit.get('provinceResidencePlace').value;
        const body = {
          districtName: districtName,
          districtType: 'Quận/Huyện',
          provinceId: provinceId,
        };
        this._addressService.createDistrict(body).subscribe((res) => {
          this.districtResidencePlace = [...this.districtResidencePlace, res.data];
          if (
            this.formPersonalEdit.get('provinceBirthPlace').value != null &&
            provinceId == this.formPersonalEdit.get('provinceBirthPlace').value
          ) {
            this.districtBirthPlace = [...this.districtBirthPlace, res.data];
          }
          this._toastrService.success(
            'Thêm thành công Quận/Huyện ' +
              res.data.districtName +
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
        const provinceId = this.formPersonalEdit.get('provinceBirthPlace').value;
        const body = {
          districtName: districtName,
          districtType: 'Quận/Huyện',
          provinceId: provinceId,
        };
        //Tạo dữ liệu Quận/Huyện mới - lấy từ dữ liệu Tỉnh/Thành phố đã select
        this._addressService.createDistrict(body).subscribe((res) => {
          //Cập nhật state do khi lưu dữ liệu lên server nhưng select không cập nhật dữ liệu mới
          this.districtBirthPlace = [...this.districtBirthPlace, res.data];
          this.districtResidencePlace = [...this.districtResidencePlace, res.data];
          if (
            this.formPersonalEdit.get('provinceResidencePlace').value != null &&
            provinceId == this.formPersonalEdit.get('provinceResidencePlace').value
          ) {
            this.districtResidencePlace = [
              ...this.districtResidencePlace,
              res.data,
            ];
          }
          //Gửi thông báo thành công lên góc bên phải màn hình
          this._toastrService.success(
            'Thêm thành công Quận/Huyện ' +
              res.data.districtName +
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
  onSubmitCreateCommune(type,communeName){
    switch (type) {
      case 1: {
        const districtId = this.formPersonalEdit.get('districtResidencePlace').value;
        const body = {
          communeName: communeName,
          communeType: 'Xã/Phường',
          districtId: districtId,
        };
        this._addressService.createCommune(body).subscribe((res) => {
          this.communeResidencePlace = [...this.communeResidencePlace, res.data];
          if (
            this.formPersonalEdit.get('districtBirthPlace').value != null &&
            districtId == this.formPersonalEdit.get('districtBirthPlace').value
          ) {
            this.communeBirthPlace = [...this.communeBirthPlace, res.data];
          }
          this._toastrService.success(
            'Thêm thành công Xã/Phường ' +
              res.data.communeName +
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
        const districtId = this.formPersonalEdit.get('districtBirthPlace').value;
        const body = {
          communeName: communeName,
          communeType: 'Xã/Phường',
          districtId: districtId,
        };
        //Tạo dữ liệu xã/phường mới - lấy từ dữ liệu quận huyện đã select
        this._addressService.createCommune(body).subscribe((res) => {
          //Cập nhật state do khi lưu dữ liệu lên server nhưng select không cập nhật dữ liệu mới
          this.communeBirthPlace = [...this.communeBirthPlace, res.data];
          this.communeResidencePlace = [...this.communeResidencePlace, res.data];
          if (
            this.formPersonalEdit.get('districtResidencePlace').value != null &&
            districtId == this.formPersonalEdit.get('districtResidencePlace').value
          ) {
            this.communeResidencePlace = [
              ...this.communeResidencePlace,
              res.data,
            ];
          }
          //Gửi thông báo thành công lên góc bên phải màn hình
          this._toastrService.success(
            'Thêm thành công Xã/Phường ' +
              res.data.communeName +
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
  onSubmitCreateStreet(type, streetName) {
    switch (type) {
      case 1: {
        const communeId = this.formPersonalEdit.get(
          'communeResidencePlace'
        ).value;
        const body = {
          streetName: streetName,
          streetType: 'Đường',
          communeId: communeId,
        };
        this._addressService.createStreet(body).subscribe((res) => {
          this.streetResidencePlace = [...this.streetResidencePlace, res.data];
          if (
            this.formPersonalEdit.get('communeBirthPlace').value != null &&
            communeId == this.formPersonalEdit.get('communeBirthPlace').value
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
        const communeId = this.formPersonalEdit.get('communeBirthPlace').value;
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
            this.formPersonalEdit.get('communeResidencePlace').value != null &&
            communeId ==
              this.formPersonalEdit.get('communeResidencePlace').value
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
    return this.formPersonalEdit.controls;
  }
  inputImage(event) {
    if (typeof FileReader !== 'undefined') {
      const reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (e: any) => {
        this.image = e.target.result;
        console.log(this.image);
        console.log(this.image.split(',')[1]);
        this.formPersonalEdit.patchValue({
          photo: this.image.split(',')[1],
        });
      };
    }
  }
  onSubmit() {
    if (!this.formPersonalEdit.valid) {
      this.submitted = true;
      return;
    }
    this.confirmOpen();
  }
  confirmOpen() {
    Swal.fire({
      title: 'Bạn có chắc muốn cập nhật?',
      text: 'Bạn sẽ không thể hoàn tác điều này!',
      icon: 'warning',
      showCancelButton: true,
      preConfirm: async () => {
        return await this._personalService
          .updatePersonal(JSON.stringify(this.formPersonalEdit.value))
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
  //Xóa thuê bao
  deletePersonal(staffId) {
    console.log(staffId);
    this._personalService.deletePersonal(staffId).subscribe((res) => {
      if (res.result === true) {
        this.router.navigate(['/apps/ip/subscribers-list']);
        this._toastrService.success(
          'Xóa Thuê Bao cá nhân thành công ',
          'Thành công',
          { toastClass: 'toast ngx-toastr', closeButton: true }
        );
      }
    });
  }
  openConfirmDelete() {
    const routerParams = this.route.snapshot.paramMap
    const id = routerParams.get('id')
    console.log(id);
    this.confirmRemovePersonal(id);
  }
  confirmRemovePersonal(staffId) {
    Swal.fire({
      title: 'Bạn có chắc muốn xóa?',
      text: 'Bạn sẽ không thể hoàn tác điều này!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#7367F0',
      preConfirm:async () => {
        this.deletePersonal(staffId);
      },
      cancelButtonColor: '#E42728',
      cancelButtonText: 'Thoát',
      confirmButtonText: 'Đúng, tôi muốn xóa!',
      customClass: {
        confirmButton: 'btn btn-primary',
        cancelButton: 'btn btn-danger ml-1',
      },
      allowOutsideClick: () => {
        return !Swal.isLoading();
      },
    }).then(function (result: any) {
      console.log(result);
      if (result.value) {
        Swal.fire({
          icon: 'success',
          title: 'Thành công!',
          text: 'Bạn đã xóa thành công',
          customClass: {
            confirmButton: 'btn btn-success',
          },
        });
      }
    });
  }

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
    await this._personalService
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
    this._personalService
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
}
