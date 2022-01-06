import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import {
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
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { Organization } from 'app/main/models/Organization';
import { Province, District, Commune, Street } from 'app/main/models/Address';
import { OrganizationListService } from '../../subscribers/organizations/organization-list/organization-list.service';
import { AddressService } from '../../address.service';
import Swal from 'sweetalert2';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

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
  public personal: Personal;
  public url = this.router.url;
  public organizationId: Organization[];
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

  private readonly currentUser = JSON.parse(
    localStorage.getItem('currentUser')
  );

  // public avatarImage: string ;
  @ViewChild('accountForm') accountForm: NgForm;
  formProfile: FormGroup;
  formInfoEdit: FormGroup;
  public submitted = false;
  constructor(
    private dateAdapter: DateAdapter<any>,
    // private _authenticationService: AuthenticationService
    private _usersService: UsersService,
    private fb: FormBuilder,
    private _addressService: AddressService,
    private _authenticationService: AuthenticationService,
    private _organizationListService: OrganizationListService,
    private router: Router,
    private modalService: NgbModal,
    private _toastrService: ToastrService
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
    // get organizationID
    this.organizationId = await this._organizationListService
      .getAllOrganizations()
      .pipe(takeUntil(this._unsubscribeAll))
      .toPromise()
      .then((res) => {
        console.log(res.data);

        return res.data;
      });

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
  onSubmit() {
    if (!this.formInfoEdit.valid) {
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
}
