import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  AddressFull,
  Commune,
  District,
  Province,
  Street,
} from 'app/main/models/Address';
import { Organization } from 'app/main/models/Organization';
import { Personal } from 'app/main/models/Personal';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { OrganizationEditService } from './organization-edit.service';

@Component({
  selector: 'app-organization-edit',
  templateUrl: './organization-edit.component.html',
  styleUrls: ['./organization-edit.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class OrganizationEditComponent implements OnInit {
  public contentHeader: object;
  public personal: Organization;
  public address: AddressFull;
  private _unsubscribeAll = new Subject();
  public lastValue;
  public url = this.router.url;
  submitted = false;
  public image = '';
  public countryCode: any[] = [
    {
      countryId: 237,
      countryName: 'Việt Nam',
      countryCode: 'VN',
      countryType: 'Independent State',
    },
  ];
  public provinceName: Province[];
  public districtName: District[];
  public communeName: Commune[];
  public streetName: Street[];
  public buttonReturn: object;

  roleArray: any[] = [];
  public getRoles;
  private readonly currentUser = JSON.parse(
    localStorage.getItem('currentUser')
  );
  formOrganizationEdit: FormGroup;
  formRoleEdit: FormGroup;
  formUpdateRole: FormGroup;
  formAddress: FormGroup;
  constructor(
    private fb: FormBuilder,
    private _organizationEditService: OrganizationEditService,
    private router: Router,
    private modalService: NgbModal,
    private _toastrService: ToastrService,
    private route: ActivatedRoute
  ) {
    this.formOrganizationEdit = this.fb.group({
      userId: [null, Validators.required],
      username: ['', [Validators.required]],
      email: [null, [Validators.required, Validators.email]],
      organizationName: [''],
      countryOrganizationId: ['', [Validators.required]],
      subscriberCategoryName: ['', [Validators.required]],
      website: [null, [Validators.required]],
      phoneNumber: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.pattern(/(01|03|05|07|08|09|02[0|1|2|3|4|5|6|7|8|9])+([0-9]{8})\b/),
        ],
      ],
      parentOrganizationName: [''],
      leaderName: ['', [Validators.required]],
      position: [null],
    });
    this.formAddress = this.fb.group({
      address: ['', [Validators.required]],
      houseNumber: [null, [Validators.required]],
      districtName: [null, [Validators.required]],
      provinceName: [null, [Validators.required]],
      communeName: [null, [Validators.required]],
      streetName: [null, [Validators.required]],
      countryCode: [this.countryCode[0].countryId, [Validators.required]],
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
      textButton: 'Quay lại',
      actionButton: true,
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
    console.log(this.buttonReturn);
    this.lastValue = this.url.substr(this.url.lastIndexOf('/') + 1);
    this.personal = await this._organizationEditService
      .getOrganizationId(this.lastValue)
      .pipe(takeUntil(this._unsubscribeAll))
      .toPromise()
      .then((res) => {
        return res.data;
      });
    console.log(this.personal);
    const addressId = this.personal.address.addressId;
    this.formOrganizationEdit.patchValue({
      userId: this.personal.organizationId,
      username: this.personal.username,
      email: this.personal.email,
      organizationName: this.personal.organizationName,
      countryOrganizationId: this.personal.countryOrganizationId,
      subscriberCategoryName: this.personal.subscriberCategoryName,
      website: this.personal.website,
      phoneNumber: this.personal.phoneNumber,
      parentOrganizationName: this.personal.parentOrganizationName,
      leaderName: this.personal.leaderName,
    });

    this.address = await this._organizationEditService
      .getAddressById(addressId)
      .pipe(takeUntil(this._unsubscribeAll))
      .toPromise()
      .then((res) => {
        return res.data;
      });
    console.log(this.address);

    this.formAddress.patchValue({
      houseNumber: this.address.houseNumber,
      streetName: this.address.streetName,
      provinceName: this.address.provinceName,
      districtName: this.address.districtName,
      communeName: this.address.communeName,
    });

    //set provinceName
    this.provinceName = await this._organizationEditService
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

    this.provinceName.forEach((province) => {
      if (province.provinceId == this.personal.address.provinceId) {
        this.formAddress.get('provinceName').setValue(province.provinceId);
      }
    });

    // set districtName
    this.districtName = await this._organizationEditService
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

    this.districtName.forEach((district) => {
      if (district.districtId == this.personal.address.districtId) {
        this.formAddress.get('districtName').setValue(district.districtId);
      }
    });

    // set communeName

    this.communeName = await this._organizationEditService
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

    this.communeName.forEach((commune) => {
      if (commune.communeId == this.personal.address.communeId) {
        this.formAddress.get('communeName').setValue(commune.communeId);
      }
    });

    // set streetName
    this.streetName = await this._organizationEditService
      .getStreet(this.personal.address.communeId)
      .pipe(
        map((res) => {
          const data = res.data.map((street) => ({
            ...street,
            streetDisplay: street.streetType + ' ' + street.streetName,
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

    this.streetName.forEach((street) => {
      if (street.streetId == this.personal.address.streetId) {
        this.formAddress.get('streetName').setValue(street.streetId);
      }
    });
  }

  get f() {
    return this.formOrganizationEdit.controls;
  }
  get fa() {
    return this.formAddress.controls;
  }

  // Xóa thuê bao
  deleteOrganization(organizationId) {
    console.log(organizationId);
    this._organizationEditService
      .deleteOrganization(organizationId)
      .subscribe((res) => {
        if (res.result === true) {
          this.router.navigate(['/apps/ip/subscribers-list']);
          this._toastrService.success(
            'Xóa Thuê Bao tổ chức thành công ',
            'Thành công',
            { toastClass: 'toast ngx-toastr', closeButton: true }
          );
        }
      });
  }
  openConfirmDelete() {
    const routerParams = this.route.snapshot.paramMap;
    const id = routerParams.get('id');
    console.log(id);
    this.confirmRemoveOrganization(id);
  }
  confirmRemoveOrganization(organizationId) {
    Swal.fire({
      title: 'Bạn có chắc muốn xóa?',
      text: 'Bạn sẽ không thể hoàn tác điều này!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#7367F0',
      preConfirm: async () => {
        this.deleteOrganization(organizationId);
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

  //Tải ảnh và chuyển sang base64
  inputImage(event) {
    if (typeof FileReader !== 'undefined') {
      const reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (e: any) => {
        this.image = e.target.result;
        console.log(this.image);
        console.log(this.image.split(',')[1]);
        this.formOrganizationEdit.patchValue({
          photo: this.image.split(',')[1],
        });
      };
    }
  }
  selectProvince() {
    this.formAddress.patchValue({
      districtName: null,
      communeName: null,
      streetName: null,
      houseNumber: null,
    });
    this._organizationEditService
      .getDistrict(this.formAddress.get('provinceName').value)
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
        this.districtName = res;
        this.formAddress.get('districtName').enable();
      });
  }

  selectDistrict() {
    this.formAddress.patchValue({
      communeName: null,
      streetName: null,
      houseNumber: null,
    });
    this._organizationEditService
      .getCommune(this.formAddress.get('districtName').value)
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
        this.communeName = res;
        this.formAddress.get('communeName').enable();
      });
  }
  selectCommune() {
    this.formAddress.patchValue({
      streetName: null,
      houseNumber: null,
    });
    this._organizationEditService
      .getStreet(this.formAddress.get('communeName').value)
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
        this.streetName = res;
        this.formAddress.get('streetName').enable();
      });
  }
  selectStreet() {
    this.formAddress.patchValue({
      houseNumber: null,
    });
    this.formAddress.get('houseNumber').enable();
  }

  modalOpenCreateStreet(modalSuccess) {
    this.modalService.open(modalSuccess, {
      centered: true,
      windowClass: 'modal modal-success',
    });
  }

  onSubmitCreateProvince(provinceName) {
    const countryId = this.formAddress.get('countryCode').value;
    const body = {
      provinceName: provinceName,
      provinceType: 'Tỉnh/Thành phố',
      countryId: countryId,
    };
    this._organizationEditService.createProvince(body).subscribe((res) => {
      this.provinceName = [...this.provinceName, res.data];
      if (
        this.formAddress.get('countryCode').value != null &&
        countryId == this.formAddress.get('countryCode').value
      ) {
        this.provinceName = [...this.provinceName, res.data];
      }
      this._toastrService.success(
        'Thêm thành công Tỉnh/Thành phố ' +
          res.data.provinceName +
          ' vào cơ sở dữ liệu',
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
  onSubmitCreateDistrict(districtName) {
    const provinceId = this.formAddress.get('provinceName').value;
    const body = {
      districtName: districtName,
      districtType: 'Quận/Huyện',
      provinceId: provinceId,
    };
    this._organizationEditService.createDistrict(body).subscribe((res) => {
      this.districtName = [...this.districtName, res.data];
      if (
        this.formAddress.get('provinceName').value != null &&
        provinceId == this.formAddress.get('provinceName').value
      ) {
        this.districtName = [...this.districtName, res.data];
      }
      this._toastrService.success(
        'Thêm thành công Quận/Huyện ' +
          res.data.districtName +
          ' vào cơ sở dữ liệu',
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
  onSubmitCreateCommune(communeName) {
    const districtId = this.formAddress.get('districtName').value;
    const body = {
      communeName: communeName,
      communeType: 'Xã/Phường',
      districtId: districtId,
    };
    this._organizationEditService.createCommune(body).subscribe((res) => {
      this.communeName = [...this.communeName, res.data];
      if (
        this.formAddress.get('districtName').value != null &&
        districtId == this.formAddress.get('districtName').value
      ) {
        this.communeName = [...this.communeName, res.data];
      }
      this._toastrService.success(
        'Thêm thành công Xã/Phường ' +
          res.data.communeName +
          ' vào cơ sở dữ liệu',
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
  onSubmitCreateStreet(streetName) {
    const communeId = this.formAddress.get('communeName').value;
    const body = {
      streetName: streetName,
      streetType: 'Đường',
      communeId: communeId,
    };
    this._organizationEditService.createStreet(body).subscribe((res) => {
      this.streetName = [...this.streetName, res.data];
      if (
        this.formAddress.get('communeName').value != null &&
        communeId == this.formAddress.get('communeName').value
      ) {
        this.streetName = [...this.streetName, res.data];
      }
      this._toastrService.success(
        'Thêm thành công đường ' + res.data.streetName + ' vào cơ sở dữ liệu',
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

  onSubmit() {
    if (!this.formOrganizationEdit.valid && !this.formAddress.valid) {
      this.submitted = true;
      return;
    }
    this.confirmOpen();
  }

  confirmOpen() {
    const updateOrganization = {
      userId: this.formOrganizationEdit.value.userId,
      countryOrganizationId:
        this.formOrganizationEdit.value.countryOrganizationId,
      organizationName: this.formOrganizationEdit.value.organizationName,
      parentOrganizationId: 1,
      subscriberCategoryId: 3,
      leaderName: this.formOrganizationEdit.value.leaderName,
      province: this.formAddress.value.provinceName,
      district: this.formAddress.value.districtName,
      commune: this.formAddress.value.communeName,
      street: this.formAddress.value.streetName,
      homeNumber: this.formAddress.value.houseNumber,
      country: this.formAddress.value.countryCode,
      phoneNumber: this.formOrganizationEdit.value.phoneNumber,
      website: this.formOrganizationEdit.value.website,
      email: this.formOrganizationEdit.value.email,
      isParent: false,
    };
    console.log(updateOrganization);
    Swal.fire({
      title: 'Bạn có chắc muốn cập nhật?',
      text: 'Bạn sẽ không thể hoàn tác điều này!',
      icon: 'warning',
      showCancelButton: true,
      preConfirm: async () => {
        return await this._organizationEditService
          .updateOrganization(JSON.stringify(updateOrganization))
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

  // update role
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
    await this._organizationEditService
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
    this._organizationEditService
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
