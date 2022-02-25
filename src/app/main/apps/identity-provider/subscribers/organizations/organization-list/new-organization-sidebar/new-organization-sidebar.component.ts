import {
  Organization,
  OrganizationCategory,
} from './../../../../../../models/Organization';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';
import { Commune, District, Province, Street } from 'app/main/models/Address';
import { AddressService } from 'app/main/apps/identity-provider/address.service';
import { map, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { OrganizationListService } from './../organization-list.service';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';
import { Observable, of } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-new-organization-sidebar',
  templateUrl: './new-organization-sidebar.component.html',
  styleUrls: ['./new-organization-sidebar.component.scss'],
})
export class NewOrganizationSidebarComponent implements OnInit {
  @Output() onUpdate = new EventEmitter<any>();
  @Output() onClose = new EventEmitter<any>();
  public submitted = false;
  public flag: any;
  private _unsubscribeAll = new Subject();
  public organizationList: Organization[];
  public typeOrganization: any[];
  public image = '';
  [x: string]: any;
  public country: any[] = [
    {
      countryId: 237,
      countryName: 'Việt Nam',
      countryCode: 'VN',
      countryType: 'Independent State',
    },
  ];

  public province: Province[];
  public district: District[];
  public commune: Commune[];
  public street: Street[];
  newOrganization: FormGroup;
  constructor(
    private _coreSidebarService: CoreSidebarService,
    private fb: FormBuilder,
    private _addressService: AddressService,
    private modalService: NgbModal,
    private _toastrService: ToastrService,
    private _organizationListService: OrganizationListService,
    private http: HttpClient
  ) {}
  ngOnInit(): void {
    this.newOrganization = this.fb.group(
      {
        countryOrganizationId: ['', [Validators.required]],
        organizationName: ['', [Validators.required]],
        subscriberCategoryId:[null, [Validators.required]],
        parentOrganizationName: [null, Validators.required],
        parentOrganizationId: [null, [Validators.required]],
        typeOrganization: [null, Validators.required],
        leaderName: ['', [Validators.required]],
        website: [
          '',
          [
            Validators.required,
            Validators.pattern(
              '^((?!-)[A-Za-z0-9-]' + '{1,63}(?<!-)\\.)' + '+[A-Za-z]{2,6}'
            ),
          ],
        ],
        email: ['', [Validators.required, Validators.email]],
        phoneNumber: [
          null,
          [
            Validators.required,
            Validators.minLength(10),
            Validators.pattern(/(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/),
          ],
        ],
        street: [{ value: null, disabled: true }, Validators.required],
        country: [this.country[0].countryId, Validators.required],
        province: [null, Validators.required],
        district: [{ value: null, disabled: true }, Validators.required],
        commune: [{ value: null, disabled: true }, Validators.required],
        homeNumber: [{ value: null, disabled: true }, Validators.required],
        username: [null, Validators.required],
        password: [null, Validators.required],
        photo: [null, Validators.required],
        rePassword: [null, Validators.required],
        position: [null, Validators.required],
      },
      {
        validator: MustMatch('password', 'rePassword'),
      }
    );
    this.initAddress();
    // this.getListOrganizations();
    // this.getListTypeOrganization();
    // this.setImageDefault();
    this.getOrganization();
  }

  getOrganization() {
    this._organizationListService
      .searchOrganizations(JSON.stringify(this.newOrganization.value))
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((pagedData) => {
        this.pagedData = pagedData.data;
        console.log(this.pagedData);
        this.typeOrganization = pagedData.data.data.map((organizationList) => ({
          ...organizationList,
        }));
        this.parentOrganizationName = pagedData.data.data.map(
          (organizationList) => ({
            ...organizationList,
          })
        );
        console.log('check thuê bao tổ chức');
        console.log(this.typeOrganization);
        console.log(this.parentOrganizationName);
      });
  }
  initAddress() {
    this._addressService
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
      .subscribe((res) => {
        this.province = res;
        console.log(this.province);
      });
  }
  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { whitespace: true };
  }

  //tải ảnh lên
  inputImage(event) {
    if (typeof FileReader !== 'undefined') {
      const reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (e: any) => {
        this.image = e.target.result;
        console.log(this.image);
        console.log(this.image.split(',')[1]);
        this.newOrganization.patchValue({
          photo: this.image.split(',')[1],
        });
      };
    }
  }
  // setImageDefault() {
  //   this.http.get("../../../../../assets/images/portrait/small/avatar-s-11.jpg", { responseType: "blob" }).subscribe((res) => {
  //     const reader = new FileReader();
  //     reader.readAsDataURL(res);
  //     console.log(res);
  //     reader.onloadend = () => {
  //       this.base64data = reader.result;
  //       this.imageString = this.base64data.split(",")[1];
  //       //console.log(this.imageString)
  //       this.newOrganization.patchValue({
  //         photo: this.imageString,
  //       });
  //     };
  //     console.log(this.newOrganization.value);
  //   });
  // }

  selectProvince() {
    this.newOrganization.patchValue({
      district: null,
      commune: null,
      street: null,
      homeNumber: null,
    });
    this._addressService
      .getDistrict(this.newOrganization.get('province').value)
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
        this.district = res;
        this.newOrganization.get('district').enable();
      });
  }
  selectDistrict() {
    this.newOrganization.patchValue({
      commune: null,
      street: null,
      homeNumber: null,
    });
    this._addressService
      .getCommune(this.newOrganization.get('district').value)
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
        this.commune = res;
        this.newOrganization.get('commune').enable();
      });
  }
  selectCommune() {
    this.newOrganization.patchValue({
      street: null,
      homeNumber: null,
    });
    this._addressService
      .getStreet(this.newOrganization.get('commune').value)
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
        this.street = res;
        this.newOrganization.get('street').enable();
      });
  }
  selectStreet() {
    this.newOrganization.patchValue({
      homeNumber: null,
    });
    this.newOrganization.get('homeNumber').enable();
  }
  modalOpenCreateStreet(modalSuccess) {
    this.modalService.open(modalSuccess, {
      centered: true,
      windowClass: 'modal modal-success',
    });
  }
  toggleSidebar() {
    this.modalService.dismissAll();
  }
  updateTable() {
    this.onUpdate.emit();
  }
  onSubmitCreateStreet(streetName) {
    const communeId = this.newOrganization.get('commune').value;
    const body = {
      streetName: streetName,
      streetType: 'Đường',
      communeId: communeId,
    };
    this._addressService.createStreet(body).subscribe((res) => {
      this.street = [...this.street, res.data];
      if (
        this.newOrganization.get('commune').value != null &&
        communeId == this.newOrganization.get('commune').value
      ) {
        this.street = [...this.street, res.data];
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
  get f() {
    return this.newOrganization.controls;
  }

  onSubmit() {
    // let data = this.newOrganization.value;
    // console.log(data);
    this.submitted = true;
    // stop here if form is invalid
    // if (this.newOrganization.invalid) {
    //   console.log('lỗi tại đây');
    //   return;
    // }
    const newOrganization = {
    username: this.newOrganization.value.username,
    password: this.newOrganization.value.password,
    countryOrganizationId: this.newOrganization.value.countryOrganizationId ,
    parentOrganizationId: 1,
    organizationName: this.newOrganization.value.organizationName,
    subscriberCategoryId: 3,
    leaderName: this.newOrganization.value.leaderName,
    province: this.newOrganization.value.province,
    district: this.newOrganization.value.district,
    commune: this.newOrganization.value.commune,
    street: this.newOrganization.value.street,
    homeNumber: this.newOrganization.value.homeNumber,
    country: this.newOrganization.value.country,
    phoneNumber: this.newOrganization.value.phoneNumber,
    website: this.newOrganization.value.website,
    email : this.newOrganization.value.email,
    photo: this.newOrganization.value.photo,
    isParent: false,
    };
    console.log(newOrganization);
    this._organizationListService
      .submitForm(JSON.stringify(newOrganization))
      .subscribe((res: any) => {
        console.log(res);
        if (res.result === true) {
          this.updateTable();
          this.toggleSidebar();
          this._toastrService.success(
            'Đăng ký thuê bao tổ chức thành công ',
            'Thành công',
            {
              positionClass: 'toast-top-center',
              toastClass: 'toast ngx-toastr',
              closeButton: true,
            }
          );
        }
        if (res.result === false) {
          this._toastrService.error(
            'Email hoặc Số điện thoại đã tồn tại ',
            'Thất bại',
            {
              positionClass: 'toast-top-center',
              toastClass: 'toast ngx-toastr',
              closeButton: true,
            }
          );
        }
      });
   
  }
  // getListOrganizations() {
  //   this._organizationListService
  //     .getListSelectOrganization()
  //     .pipe(
  //       map((res) => {
  //         const data = res.data.data.map((Organization) => ({
  //           ...Organization,
  //           // subscriberCategory: Organization.subscriberCategory.subscriberCategoryId
  //         }));
  //         return data;
  //       }),
  //       takeUntil(this._unsubscribeAll)
  //     )
  //     .subscribe((res) => {
  //       this.organizationList = res;
  //       console.log(this.organizationList);
  //     });
  // }
  // getListTypeOrganization() {
  //   this._organizationListService
  //     .getListOrganizationCategory()
  //     .subscribe((res:any) => {
  //       console.log(res)
  //       res.data.forEach(function (item, index) {
  //         if (item.subscriberCategoryName === "Cá nhân") {
  //           res.data.splice(index, 1);
  //         }
  //       });
  //       this.typeOrganization = res.data;
  //     });
  // }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
export function MustMatch(controlName: string, matchingControlName: string) {
  return (formGroup: FormGroup) => {
    const control = formGroup.controls[controlName];
    const matchingControl = formGroup.controls[matchingControlName];
    if (matchingControl?.errors && !matchingControl?.errors?.mustMatch) {
      // return if another validator has already found an error on the matchingControl
      return;
    }
    // set error on matchingControl if validation fails
    if (control.value !== matchingControl.value) {
      matchingControl.setErrors({ mustMatch: true });
    } else {
      matchingControl.setErrors(null);
    }
  };
}
