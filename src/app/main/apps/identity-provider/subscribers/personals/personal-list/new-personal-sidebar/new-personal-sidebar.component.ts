import { HttpClient } from "@angular/common/http";
import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from "@angular/forms";
import { DateAdapter } from "@angular/material/core";
import { CoreConfigService } from "@core/services/config.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { AddressService } from "app/main/apps/identity-provider/address.service";
import { Commune, District, Province, Street } from "app/main/models/Address";
import { environment } from "environments/environment";
import { ToastrService } from "ngx-toastr";
import { Observable, of, Subject } from "rxjs";
import { map, takeUntil } from "rxjs/operators";

@Component({
  selector: "app-new-personal-sidebar",
  templateUrl: "./new-personal-sidebar.component.html",
  styleUrls: ["./new-personal-sidebar.component.scss"],
  providers: [AddressService],
})
export class NewPersonalSidebarComponent implements OnInit {
  /** @Private */
  private _unsubscribeAll = new Subject();

  /** @public */
  coreConfig: any;
  public submitted = false;
  public display = "none"; //default Variable
  /**@form */
  public newPersonal: FormGroup;
  public email;
  //BirthPlace
  public countryBirthPlace: any[] = [
    {
      countryId: 237,
      countryName: "Việt Nam",
      countryCode: "VN",
      countryType: "Independent State",
    },
  ];
  provinceBirthPlace: Province[];
  districtBirthPlace: District[];
  communeBirthPlace: Commune[];
  streetBirthPlace: Street[];

  //ResidencePlace
  public countryResidencePlace: any[] = [
    {
      countryId: 237,
      countryName: "Việt Nam",
      countryCode: "VN",
      countryType: "Independent State",
    },
  ];
  public provinceResidencePlace: Province[];
  public districtResidencePlace: District[];
  communeResidencePlace: Commune[];
  streetResidencePlace: Street[];
  organizationId: any[] = ["CMC", "CIST", "FPT"];
  gender: any[] = ["Nam", "Nữ"];
  @Output() onClose = new EventEmitter<any>();
  @Output() onUpdate = new EventEmitter<any>();

  /**
   * Constructor
   *
   * @param {NgbModal} modalService
   * @param {HttpClient} _httpClient
   */
  constructor(
    private _httpClient: HttpClient,
    private fb: FormBuilder,
    private modalService: NgbModal,
    private _addressService: AddressService,
    private _toastrService: ToastrService,
    private dateAdapter: DateAdapter<any>,
    private _coreConfigService: CoreConfigService
  ) {
    this._coreConfigService.config.pipe(takeUntil(this._unsubscribeAll)).subscribe(config => {
      this.dateAdapter.setLocale(config.app.appLanguage); 
    });
  }

  ngOnInit(): void {
    this.newPersonal = this.fb.group({
      personalFirstName: [null, [Validators.required]],
      personalMiddleName: [null, Validators.required],
      personalLastName: [null, Validators.required],
      phoneNumber: [null, Validators.required, , Validators.minLength(10)],
      personalCountryId: [null, Validators.required],
      organizationId: [null, Validators.required],
      streetBirthPlace: [{value:null, disabled : true}, Validators.required],
      countryBirthPlace: [this.countryBirthPlace[0]],
      provinceBirthPlace: [null, Validators.required],
      districtBirthPlace: [{value:null, disabled : true}, Validators.required],
      communeBirthPlace: [{value:null, disabled : true}, Validators.required],
      homeNumberBirthPlace: [{value:null, disabled : true}, Validators.required],
      countryResidencePlace: [this.countryResidencePlace[0]],
      provinceResidencePlace: [null, Validators.required],
      districtResidencePlace: [{value:null, disabled : true}, Validators.required],
      communeResidencePlace: [{value:null, disabled : true}, Validators.required],
      streetResidencePlace: [{value:null, disabled : true}, Validators.required],
      homeNumberResidencePlace: [{value:null, disabled : true}, Validators.required],
      gender: [this.gender[0], [Validators.required]],
      birthday: [null, [Validators.required, Validators.minLength(22)]],
      email: [null, [Validators.required, Validators.email]],
    });

    this.initAddress();
  }

//Khởi tạo các địa chỉ ban đầu và select sẵn các giá trị, nhưng không cần thiết làm như trang tiêm chủng
  // initAddress() {
  //   this._addressService
  //     .getProvince(237)
  //     .pipe(
  //       map((res) => {
  //         const data = res.data.map((city) => ({
  //           ...city,
  //           provinceDisplay: city.provinceType + " " + city.provinceName,
  //         }));
  //         return data;
  //       }),
  //       takeUntil(this._unsubscribeAll)
  //     )
  //     .subscribe((res) => {
  //       this.provinceResidencePlace = res;
  //       this.provinceBirthPlace = res;
  //       this._addressService
  //         .getDistrict(this.provinceResidencePlace[0].provinceId)
  //         .pipe(
  //           map((res) => {
  //             const data = res.data.map((district) => ({
  //               ...district,
  //               districtDisplay:
  //                 district.districtType + " " + district.districtName,
  //             }));
  //             return data;
  //           }),
  //           takeUntil(this._unsubscribeAll)
  //         )
  //         .subscribe((res) => {
  //           this.districtResidencePlace = res;
  //           this.districtBirthPlace = res;
  //           this._addressService
  //             .getCommune(this.districtResidencePlace[0].districtId)
  //             .pipe(
  //               map((res) => {
  //                 const data = res.data.map((commune) => ({
  //                   ...commune,
  //                   communeDisplay:
  //                     commune.communeType + " " + commune.communeName,
  //                 }));
  //                 return data;
  //               }),
  //               takeUntil(this._unsubscribeAll)
  //             )
  //             .subscribe((res) => {
  //               this.communeResidencePlace = res;
  //               this.communeBirthPlace = res;
  //               this._addressService
  //                 .getStreet(this.communeBirthPlace[0].communeId)
  //                 .pipe(takeUntil(this._unsubscribeAll))
  //                 .subscribe((res) => {
  //                   this.streetResidencePlace = res.data;
  //                   this.streetBirthPlace = res.data;
  //                 });
  //             });
  //         });
  //     });
  // }

initAddress() {
    this._addressService
      .getProvince(237)
      .pipe(
        map((res) => {
          const data = res.data.map((city) => ({
            ...city,
            provinceDisplay: city.provinceType + " " + city.provinceName,
          }));
          return data;
        }),
        takeUntil(this._unsubscribeAll)
      )
      .subscribe((res) => {
        this.provinceResidencePlace = res;
        this.provinceBirthPlace = res;
      }); 
  }
selectProvince(type){
  switch (type) {
    case 2: {
      this.newPersonal.patchValue({
        districtResidencePlace : null,
        communeResidencePlace : null, 
        streetResidencePlace : null, 
        homeNumberResidencePlace:null,
      })
      this._addressService
              .getDistrict(this.newPersonal.get('provinceResidencePlace').value.provinceId)
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
                this.districtResidencePlace =res;
                this.newPersonal.get('districtResidencePlace').enable();
              })
      break;
    };
    case 1: {
      this.newPersonal.patchValue({
        districtBirthPlace : null,
        communeBirthPlace : null, 
        streetBirthPlace : null, 
        homeNumberBirthPlace:null,
      })
      this._addressService
              .getDistrict(this.newPersonal.get('provinceBirthPlace').value.provinceId)
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
                this.newPersonal.get('districtBirthPlace').enable();
              })
              break;
    };
  }
}

selectDistrict(type:number){
  switch (type) {
    case 2: {
      this.newPersonal.patchValue({
        communeResidencePlace : null, 
        streetResidencePlace : null, 
        homeNumberResidencePlace:null,
      })
      this._addressService
              .getCommune(this.newPersonal.get('districtResidencePlace').value.districtId)
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
                this.newPersonal.get('communeResidencePlace').enable();
              });
              break;
    };
    case 1: {
      this.newPersonal.patchValue({
        communeBirthPlace : null, 
        streetBirthPlace : null, 
        homeNumberBirthPlace:null,
      })
      this._addressService
              .getCommune(this.newPersonal.get('districtBirthPlace').value.districtId)
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
                this.newPersonal.get('communeBirthPlace').enable();
              })
    };
    break;
  }
}
selectCommune(type:number){
  switch (type) {
    case 2: {
      this.newPersonal.patchValue({
        streetResidencePlace : null, 
        homeNumberResidencePlace:null,
      })
      this._addressService
              .getStreet(this.newPersonal.get('communeResidencePlace').value.communeId)
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
                this.newPersonal.get('streetResidencePlace').enable();
              })
              break;
    };
    case 1: {
      this.newPersonal.patchValue({
        streetBirthPlace : null, 
        homeNumberBirthPlace:null,
      })
      this._addressService
              .getStreet(this.newPersonal.get('communeBirthPlace').value.communeId)
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
                this.newPersonal.get('streetBirthPlace').enable();
              });
              break;
    };
  }
}
selectStreet(type:number){
  switch (type) {
    case 2: {
      this.newPersonal.patchValue({
        homeNumberResidencePlace:null,
      })
      this.newPersonal.get('homeNumberResidencePlace').enable();
              break;
    };
    case 1: {
      this.newPersonal.patchValue({
        homeNumberBirthPlace:null,
      })
      this.newPersonal.get('homeNumberBirthPlace').enable();
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
      const communeId = this.newPersonal.get("communeResidencePlace").value
        .communeId;
      const body = {
        streetName: streetName,
        streetType: "Đường",
        communeId: communeId,
      };
      this._addressService.createStreet(body).subscribe((res) => {
        this.streetResidencePlace = [...this.streetResidencePlace, res.data];
        if(this.newPersonal.get("communeBirthPlace").value!=null&&communeId==this.newPersonal.get("communeBirthPlace").value.communeId){
          this.streetBirthPlace = [...this.streetBirthPlace, res.data];
        }
        this._toastrService.success(
          "Thêm thành công đường " +
            res.data.streetName +
            "vào cơ sở dữ liệu",
          "Thành công",
          { toastClass: "toast ngx-toastr", closeButton: true }
        );
      });
      return true;
    }
    case 2: {
      const communeId =
        this.newPersonal.get("communeBirthPlace").value.communeId;
      const body = {
        streetName: streetName,
        streetType: "Đường",
        communeId: communeId,
      };
      //Tạo dữ liệu đường mới lấy từ dữ liệu phường xã đã select
      this._addressService.createStreet(body).subscribe((res) => {
        //Cập nhật state do khi lưu dữ liệu lên server nhưng select không cập nhật dữ liệu mới
        this.streetBirthPlace = [...this.streetBirthPlace, res.data];
        if(this.newPersonal.get("communeResidencePlace").value!=null&&communeId==this.newPersonal.get("communeResidencePlace").value.communeId){
          this.streetResidencePlace = [...this.streetResidencePlace, res.data];
        }
        //Gửi thông báo thành công lên góc bên phải màn hình
        this._toastrService.success(
          "Thêm thành công đường " +
            res.data.streetName +
            "vào cơ sở dữ liệu",
          "Thành công",
          { toastClass: "toast ngx-toastr", closeButton: true }
        );
      });
      return true;
    }
  }
}

  toggleSidebar() {
    this.modalService.dismissAll();
  }

  closeModal() {
    this.onClose.emit();
  }
  updateTable() {
    this.onUpdate.emit();
  }

  get f() {
    return this.newPersonal.controls;
  }

  onSubmit() {
    this.submitted = true;
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const token = currentUser.token;

    // stop here if form is invalid
    if (this.newPersonal.invalid) {
      return;
    }
    const newPersonal = JSON.stringify(this.newPersonal.value);
    console.log(newPersonal);
    const option = {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    };
    // display form values on success
    return this._httpClient
      .post<any>(`${environment.apiUrl}/personal/create`, newPersonal, option)
      .subscribe((respon: any) => {
        if ((respon.result = "true")) {
          this.toggleSidebar();
          this.updateTable();
        }
      });
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
