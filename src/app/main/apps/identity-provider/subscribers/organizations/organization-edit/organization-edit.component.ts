import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AddressFull, Province } from 'app/main/models/Address';
import { Organization } from 'app/main/models/Organization';
import { Personal } from 'app/main/models/Personal';
import { Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
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
  public countryCode: any[] = [
    {
      countryId: 237,
      countryName: 'Việt Nam',
      countryCode: 'VN',
      countryType: 'Independent State',
    },
  ];
  public provinceName: Province[];
  private readonly currentUser = JSON.parse(
    localStorage.getItem('currentUser')
  );
  formOrganizationEdit: FormGroup;
  formRoleEdit: FormGroup;
  formAddress: FormGroup;
  constructor(
    private fb: FormBuilder,
    private _organizationEditService: OrganizationEditService,
    private router: Router
  ) {
    this.formOrganizationEdit = this.fb.group({
      username: ['', [Validators.required]],
      email: [null, [Validators.required, Validators.email]],
      organizationName: ['', [Validators.required]],
      countryOrganizationId: ['', [Validators.required]],
      subscriberCategoryName: ['', [Validators.required]],
      website: [null, [Validators.required]],
      phoneNumber: ['', [Validators.required]],
      parentOrganizationName: ['', [Validators.required]],
    });
    this.formAddress = this.fb.group({
      address: ['', [Validators.required]],
      houseNumber: ['', [Validators.required]],
      districtName: ['', [Validators.required]],
      provinceName: ['', [Validators.required]],
      communeName: ['', [Validators.required]],
      streetName: ['', [Validators.required]],
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
  }

  async ngOnInit() {
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
      username: this.personal.username,
      email: this.personal.email,
      organizationName: this.personal.organizationName,
      countryOrganizationId: this.personal.countryOrganizationId,
      subscriberCategoryName: this.personal.subscriberCategoryName,
      website: this.personal.website,
      phoneNumber: this.personal.phoneNumber,
      parentOrganizationName: this.personal.parentOrganizationName,
    });

    this.address = await this._organizationEditService
      .getAddressById(addressId)
      .pipe(takeUntil(this._unsubscribeAll))
      .toPromise()
      .then((res) => {
        return res.data;
      });
    console.log(this.address);

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

    //set provinceName
    this.provinceName.forEach((province) => {
      if (province.provinceId == this.personal.address.provinceId) {
        this.formAddress.get('provinceName').setValue(province.provinceId);
      }
    });
  }

  get f() {
    return this.formOrganizationEdit.controls;
  }
}
