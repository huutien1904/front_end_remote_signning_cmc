import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
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
  formPersonalEdit: FormGroup;
  formRoleEdit: FormGroup;
  formUpdateRole: FormGroup;
  roleArray: any[] = [];
  public contentHeader: object;
  public url = this.router.url;
  public lastValue;
  public getRoles;
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
    private _toastrService: ToastrService
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
            isLink: true,
            link: '/apps/ip/subscribers-search',
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
            link: '/apps/ip/subscribers-list'
          },
          {
            name: 'Chỉnh sửa thuê bao',
            isLink: true,
            link: '/apps/ip/subscribers-search'
          }
        ]
      }
    };

    // get organizationID
    this.organizationId = await this._organizationListService
      .searchOrganizations(this.body)
      .pipe(takeUntil(this._unsubscribeAll))
      .toPromise()
      .then((res) => {
        return res.data.data;
      });

    this.personal = await this._personalService
      .getPersonalById(this.lastValue)
      .pipe(takeUntil(this._unsubscribeAll))
      .toPromise()
      .then((res) => {
        return res.data;
      });
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
