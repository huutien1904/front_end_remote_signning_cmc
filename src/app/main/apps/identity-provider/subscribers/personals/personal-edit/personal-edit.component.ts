import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Province, District, Commune, Street } from 'app/main/models/Address';
import { Organization } from 'app/main/models/Organization';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { AddressService } from '../../../address.service';
import { OrganizationListService } from '../../organizations/organization-list/organization-list.service';
import { PersonalListService } from '../personal-list/personal-list.service';
import { PersonalEditService } from './personal-edit.service';

@Component({
  selector: 'app-personal-edit',
  templateUrl: './personal-edit.component.html',
  styleUrls: ['./personal-edit.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class PersonalEditComponent implements OnInit {
  private _unsubscribeAll = new Subject();
  formPersonalEdit: FormGroup;
  public contentHeader: object;
  public url = this.router.url;
  public lastValue;
  public body = {
    "page": null,
    "size": null,
    "sort": [],
    "contains": "",
    "fromDate": "",
    "toDate": ""
  }


  public organizationId: Organization[];
  //BirthPlace
  public countryBirthPlace: any[] = [
    {
      countryId: 237,
      countryName: "Việt Nam",
      countryCode: "VN",
      countryType: "Independent State",
    },
  ];
  provinceBirthPlace: any[];
  districtBirthPlace: District[];
  communeBirthPlace: Commune[];
  streetBirthPlace: Street[];

  //ResidencePlace
  public countryResidencePlace: [any] = [
    {
      countryId: 237,
      countryName: "Việt Nam",
      countryCode: "VN",
      countryType: "Independent State",
    },

  ];
  public provinceResidencePlace: Province[];
  public districtResidencePlace: District[];
  public communeResidencePlace: Commune[];
  public streetResidencePlace: Street[];
  gender: string[] = ["Nam", "Nữ"];
  private readonly currentUser = JSON.parse(
    localStorage.getItem("currentUser")
  );
  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private _personalEditService: PersonalEditService,
    private _personalListService: PersonalListService,
    private _organizationListService: OrganizationListService,
    private _addressService: AddressService,
    private modalService: NgbModal,
    private _toastrService: ToastrService,
  ) {
    // this._unsubscribeAll = new Subject();
    this.lastValue = this.url.substr(this.url.lastIndexOf('/') + 1);
    this.formPersonalEdit = this.formBuilder.group({
      username: ["", [Validators.required,]],
      subscriberCategoryId: ["1", [Validators.required,]],
      firstName: [null, [Validators.required,]],
      middleName: [null, [Validators.required,]],
      lastName: [null, [Validators.required,]],
      phoneNumber: [null, [Validators.required, Validators.minLength(10), Validators.pattern(/(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/),]],
      personalCountryId: [null, [Validators.required, Validators.minLength(8), Validators.pattern(/^[0-9]\d*$/),]],
      organizationId: [null, Validators.required],
      streetBirthPlace: [{ value: null, disabled: true }, Validators.required],
      countryBirthPlace: [this.countryBirthPlace[0].countryId, Validators.required],
      provinceBirthPlace: [null, Validators.required],
      districtBirthPlace: [{ value: null, disabled: true }, Validators.required],
      communeBirthPlace: [{ value: null, disabled: true }, Validators.required],
      homeNumberBirthPlace: [{ value: null, disabled: true }, Validators.required],
      countryResidencePlace: [this.countryResidencePlace[0].countryId, Validators.required],
      provinceResidencePlace: [null, Validators.required],
      districtResidencePlace: [{ value: null, disabled: true }, Validators.required],
      communeResidencePlace: [{ value: null, disabled: true }, Validators.required],
      streetResidencePlace: [{ value: null, disabled: true }, Validators.required],
      homeNumberResidencePlace: [{ value: null, disabled: true }, Validators.required],
      gender: [null, [Validators.required]],
      birthday: [null, [Validators.required, Validators.minLength(22)]],
      email: [null, [Validators.required, Validators.email,]],
    });
  }

  async ngOnInit() {
    // get organizationID
    this.organizationId = await this._organizationListService.getListOrganizations(this.body)
      .pipe(takeUntil(this._unsubscribeAll))
      .toPromise().then(res => {
        return res.data.data;
      });
    console.log(this.organizationId)
    
    const data:any = await this._personalEditService.getPersonalById(this.lastValue)
      .pipe(takeUntil(this._unsubscribeAll))
      .toPromise()
      .then(res => {
        return res.data;
      });
      console.log(data);
    this.organizationId.forEach(organization => {
      if (organization.organizationName == data.organizationName) {
        this.formPersonalEdit.get("organizationId").setValue(organization.organizationId);
      }

    })
    // end get organizationId

    // set provice
    await this._addressService
      .getProvince()
      .pipe(
        map((res) => {
          console.log(res);
          const data = res.data.map((city) => ({
            ...city,
            provinceDisplay: city.provinceType + " " + city.provinceName,
          }));
          console.log(data);
          return data;
        }),
        takeUntil(this._unsubscribeAll)
      )
      .toPromise().then((res) => {
        this.provinceResidencePlace = res;
        this.provinceBirthPlace = res;
        console.log(this.provinceResidencePlace)
      });

    
    // set province birth place
    this.provinceBirthPlace.forEach(province => {
      if (province.provinceId == data.birthPlace.provinceId) {
        this.formPersonalEdit.get("provinceBirthPlace").setValue(province.provinceId);
      }

    })
    // set province residen place
    this.provinceResidencePlace.forEach(province => {
      if (province.provinceId == data.address.provinceId) {
        this.formPersonalEdit.get("provinceResidencePlace").setValue(province.provinceId);
      }

    })

    // get list district birth place
    await this._addressService
      .getDistrict(data.birthPlace.provinceId)
      .pipe(
        map((res) => {
          console.log(res);
          const data = res.data.map((district) => ({
            ...district,
                    districtDisplay:
                      district.districtType + " " + district.districtName,
          }));
          console.log(data);
          return data;
        }),
        takeUntil(this._unsubscribeAll)
      )
      .toPromise().then((res) => {
        this.districtBirthPlace = res;
        
        console.log(this.districtBirthPlace)
      });

      this.districtBirthPlace.forEach(district => {
        if (district.districtId == data.birthPlace.districtId) {
          this.formPersonalEdit.get("districtBirthPlace").setValue(district.districtId);
        }
      })
    
      // get list district resident place
      await this._addressService
      .getDistrict(data.address.provinceId)
      .pipe(
        map((res) => {
          console.log(res);
          const data = res.data.map((district) => ({
            ...district,
                    districtDisplay:
                      district.districtType + " " + district.districtName,
          }));
          console.log(data);
          return data;
        }),
        takeUntil(this._unsubscribeAll)
      )
      .toPromise().then((res) => {
        this.districtResidencePlace = res;
        
        console.log(this.districtResidencePlace)
      });

      this.districtResidencePlace.forEach(district => {
        if (district.districtId == data.address.districtId) {
          this.formPersonalEdit.get("districtResidencePlace").setValue(district.districtId);
        }
      })
      // get list commune addresss

      await this._addressService
      .getCommune(data.birthPlace.districtId)
      .pipe(
        map((res) => {
          console.log(res);
          const data = res.data.map((commune) => ({
            ...commune,
            communeDisplay:
                      commune.communeType + " " + commune.communeName,
          }));
          console.log(data);
          return data;
        }),
        takeUntil(this._unsubscribeAll)
      )
      .toPromise().then((res) => {
        this.communeBirthPlace = res;
        
        console.log(this.communeBirthPlace)
      });

      this.communeBirthPlace.forEach(commune => {
        if (commune.communeId == data.birthPlace.communeId) {
          this.formPersonalEdit.get("communeBirthPlace").setValue(commune.communeId);
        }
      })

      // get list commune residen place
      await this._addressService
      .getCommune(data.address.districtId)
      .pipe(
        map((res) => {
          console.log(res);
          const data = res.data.map((commune) => ({
            ...commune,
            communeDisplay:
                      commune.communeType + " " + commune.communeName,
          }));
          console.log(data);
          return data;
        }),
        takeUntil(this._unsubscribeAll)
      )
      .toPromise().then((res) => {
        this.communeResidencePlace = res;
        
        console.log(this.communeBirthPlace)
      });

      this.communeResidencePlace.forEach(commune => {
        if (commune.communeId == data.address.communeId) {
          this.formPersonalEdit.get("communeResidencePlace").setValue(commune.communeId);
        }
      })
      // get list street
      await this._addressService
      .getAllStreet()
      .pipe(
        map((res) => {
          console.log(res);
          const data = res.data.map((commune) => ({
            ...commune,
            communeDisplay:
                      commune.streetType + " " + commune.streetName,
          }));
          console.log(data);
          return data;
        }),
        takeUntil(this._unsubscribeAll)
      )
      .toPromise().then((res) => {
        this.streetResidencePlace = res;
        this.streetBirthPlace = res;
        
        console.log(this.communeBirthPlace)
      });

      this.streetBirthPlace.forEach(street => {
        if (street.streetId == data.birthPlace.streetId) {
          this.formPersonalEdit.get("streetBirthPlace").setValue(street.streetId);
        }
      })
      this.streetResidencePlace.forEach(street => {
        if (street.streetId == data.address.streetId) {
          this.formPersonalEdit.get("streetResidencePlace").setValue(street.streetId);
        }
      })
    this.getPersonalDetail();
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

    

  }


  

  getPersonalDetail() {
    this._unsubscribeAll = new Subject();
    this._personalEditService
      .getPersonalById(this.lastValue)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((personal: any) => {
        const data = personal.data
        console.log(data);
        this.formPersonalEdit.controls['username'].setValue(data.username);
        this.formPersonalEdit.controls['email'].setValue(data.email);
        this.formPersonalEdit.controls['firstName'].setValue(data.firstName);
        this.formPersonalEdit.controls['middleName'].setValue(data.middleName);
        this.formPersonalEdit.controls['lastName'].setValue(data.lastName);
        this.formPersonalEdit.controls['personalCountryId'].setValue(data.personalCountryId);
        this.formPersonalEdit.controls['birthday'].setValue(data.birthday);
        this.formPersonalEdit.controls['phoneNumber'].setValue(data.phoneNumber);
        this.formPersonalEdit.controls['homeNumberBirthPlace'].setValue(data.birthPlace.houseNumber);
        this.formPersonalEdit.get("gender").setValue(data.gender);
        this.formPersonalEdit.get("homeNumberResidencePlace").setValue(data.address.houseNumber);
      });
  }
  selectProvince(type){
    switch (type) {
      case 2: {
        this.formPersonalEdit.patchValue({
          districtResidencePlace : null,
          communeResidencePlace : null, 
          streetResidencePlace : null, 
          homeNumberResidencePlace:null,
        })
        this._addressService
                .getDistrict(this.formPersonalEdit.get('provinceResidencePlace').value)
                .pipe(
                  map((res) => {
                    const data = res.data.map((district) => ({
                      ...district,
                      districtDisplay:
                        district.districtType + " " + district.districtName,
                    }));
                    return data;
                  }),
                  takeUntil(this._unsubscribeAll)
                ).subscribe((res) => {
                  // console.log(res)
                  this.districtResidencePlace =res;
                  this.formPersonalEdit.get('districtResidencePlace').enable();
                })
        break;
      };
      case 1: {
        this.formPersonalEdit.patchValue({
          districtBirthPlace : null,
          communeBirthPlace : null, 
          streetBirthPlace : null, 
          homeNumberBirthPlace:null,
        })
        this._addressService
                .getDistrict(this.formPersonalEdit.get('provinceBirthPlace').value)
                .pipe(
                  map((res) => {
                    
                    const data = res.data.map((district) => ({
                      ...district,
                      districtDisplay:
                        district.districtType + " " + district.districtName,
                    }));
                    return data;
                  }),
                  takeUntil(this._unsubscribeAll)
                ).subscribe((res) => {
                  this.districtBirthPlace =res;
                  this.formPersonalEdit.get('districtBirthPlace').enable();
                })
                break;
      };
    }
  }
  
  selectDistrict(type:number){
    switch (type) {
      case 2: {
        this.formPersonalEdit.patchValue({
          communeResidencePlace : null, 
          streetResidencePlace : null, 
          homeNumberResidencePlace:null,
        })
        this._addressService
                .getCommune(this.formPersonalEdit.get('districtResidencePlace').value)
                .pipe(
                  map((res) => {
                    const data = res.data.map((commune) => ({
                      ...commune,
                      communeDisplay:
                        commune.communeType + " " + commune.communeName,
                    }));
                    return data;
                  }),
                  takeUntil(this._unsubscribeAll)
                ).subscribe((res) => {
                  this.communeResidencePlace =res;
                  this.formPersonalEdit.get('communeResidencePlace').enable();
                });
                break;
      };
      case 1: {
        this.formPersonalEdit.patchValue({
          communeBirthPlace : null, 
          streetBirthPlace : null, 
          homeNumberBirthPlace:null,
        })
        this._addressService
                .getCommune(this.formPersonalEdit.get('districtBirthPlace').value)
                .pipe(
                  map((res) => {
                    const data = res.data.map((commune) => ({
                      ...commune,
                      communeDisplay:
                        commune.communeType + " " + commune.communeName,
                    }));
                    return data;
                  }),
                  takeUntil(this._unsubscribeAll)
                ).subscribe((res) => {
                  this.communeBirthPlace =res;
                  this.formPersonalEdit.get('communeBirthPlace').enable();
                })
      };
      break;
    }
  }
  selectCommune(type:number){
    switch (type) {
      case 2: {
        this.formPersonalEdit.patchValue({
          streetResidencePlace : null, 
          homeNumberResidencePlace:null,
        })
        this._addressService
                .getStreet(this.formPersonalEdit.get('communeResidencePlace').value)
                .pipe(
                  map((res) => {
                    const data = res.data.map((street) => ({
                      ...street,
                      streetDisplay:
                        street.streetType + " " + street.streetName,
                    }));
                    return data;
                  }),
                  takeUntil(this._unsubscribeAll)
                ).subscribe((res) => {
                  this.streetResidencePlace =res;
                  this.formPersonalEdit.get('streetResidencePlace').enable();
                })
                break;
  
      };
      case 1: {
        this.formPersonalEdit.patchValue({
          streetBirthPlace : null, 
          homeNumberBirthPlace:null,
        })
        this._addressService
                .getStreet(this.formPersonalEdit.get('communeBirthPlace').value)
                .pipe(
                  map((res) => {
                    const data = res.data.map((street) => ({
                      ...street,
                      streetDisplay:
                        street.streetType + " " + street.streetName,
                    }));
                    return data;
                  }),
                  takeUntil(this._unsubscribeAll)
                ).subscribe((res) => {
                  this.streetBirthPlace =res;
                  this.formPersonalEdit.get('streetBirthPlace').enable();
                });
                break;
      };
    }
  }
  selectStreet(type:number){
    switch (type) {
      case 2: {
        this.formPersonalEdit.patchValue({
          homeNumberResidencePlace:null,
        })
        this.formPersonalEdit.get('homeNumberResidencePlace').enable();
                break;
      };
      case 1: {
        this.formPersonalEdit.patchValue({
          homeNumberBirthPlace:null,
        })
        this.formPersonalEdit.get('homeNumberBirthPlace').enable();
                break;
      };
    }
  }
  modalOpenCreateStreet(modalSuccess) {
    this.modalService.open(modalSuccess, {
      centered: true,
      windowClass: "modal modal-success",
    });
  }
  onSubmitCreateStreet(type, streetName) {
    switch (type) {
      case 1: {
        const communeId = this.formPersonalEdit.get("communeResidencePlace").value
          ;
        const body = {
          streetName: streetName,
          streetType: "Đường",
          communeId: communeId,
        };
        this._addressService.createStreet(body).subscribe((res) => {
          this.streetResidencePlace = [...this.streetResidencePlace, res.data];
          if(this.formPersonalEdit.get("communeBirthPlace").value!=null&&communeId==this.formPersonalEdit.get("communeBirthPlace").value){
            this.streetBirthPlace = [...this.streetBirthPlace, res.data];
          }
          this._toastrService.success(
            "Thêm thành công đường " +
              res.data.streetName +
              "vào cơ sở dữ liệu",
            "Thành công",
            {  
              positionClass: "toast-top-center",
              toastClass: "toast ngx-toastr",
              closeButton: true,
            }
          );
        });
        return true;
      }
      case 2: {
        const communeId =
          this.formPersonalEdit.get("communeBirthPlace").value;
        const body = {
          streetName: streetName,
          streetType: "Đường",
          communeId: communeId,
        };
        //Tạo dữ liệu đường mới lấy từ dữ liệu phường xã đã select
        this._addressService.createStreet(body).subscribe((res) => {
          //Cập nhật state do khi lưu dữ liệu lên server nhưng select không cập nhật dữ liệu mới
          this.streetBirthPlace = [...this.streetBirthPlace, res.data];
          if(this.formPersonalEdit.get("communeResidencePlace").value!=null&&communeId==this.formPersonalEdit.get("communeResidencePlace").value){
            this.streetResidencePlace = [...this.streetResidencePlace, res.data];
          }
          //Gửi thông báo thành công lên góc bên phải màn hình
          this._toastrService.success(
            "Thêm thành công đường " +
              res.data.streetName +
              "vào cơ sở dữ liệu",
            "Thành công",
            {     
            positionClass: "toast-top-center",
            toastClass: "toast ngx-toastr",
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
  onSubmit(){
    console.log(this.formPersonalEdit.value)
  }
}
// {
  
//   "districtBirthPlace": "76",
//   "communeBirthPlace": "2551",
//   "streetBirthPlace": "1",
//   "homeNumberBirthPlace": "hoang+mai+nhi",
// }