import { Overlay } from '@angular/cdk/overlay';
import { HttpClient } from "@angular/common/http";
import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  Validators
} from "@angular/forms";
import { DateAdapter } from "@angular/material/core";
import { CoreConfigService } from "@core/services/config.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { AddressService } from "app/main/apps/identity-provider/address.service";
import { Commune, District, Province, Street } from "app/main/models/Address";
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from "ngx-toastr";
import { Subject } from "rxjs";
import { map, takeUntil } from "rxjs/operators";
import { PersonalService } from '../../personal.service';

@Component({
  selector: "app-new-personal-sidebar",
  templateUrl: "./new-personal-sidebar.component.html",
  styleUrls: ["./new-personal-sidebar.component.scss"],
})
export class NewPersonalSidebarComponent implements OnInit {
  /** @Private */
  private _unsubscribeAll = new Subject();

  /** @public */
  coreConfig: any;
  public submitted = false;
  public spinner = false;
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
  public organizationId: any[] = [];
  gender: any[] = ["Nam", "Nữ"];
  public checkStreet = false;
  @Output() onClose = new EventEmitter<any>();
  @Output() onUpdate = new EventEmitter<any>();

  /**
   * Constructor
   *
   * @param {NgbModal} modalService
   * @param {HttpClient} _httpClient
   */
  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    private _addressService: AddressService,
    private _toastrService: ToastrService,
    private dateAdapter: DateAdapter<any>,
    private _coreConfigService: CoreConfigService,
    private _personalService:PersonalService,
    private overlay: Overlay,
  ) {
    this._coreConfigService.config.pipe(takeUntil(this._unsubscribeAll)).subscribe(config => {
      this.dateAdapter.setLocale(config.app.appLanguage); 
    });
  }

  ngOnInit(): void {
    this.newPersonal = this.fb.group({
      username: ["", [Validators.required,]],
      subscriberCategoryId: ["1", [Validators.required,]],
      firstName: [null, [Validators.required,]],
      middleName: [null, [Validators.required,]],
      lastName: [null, [Validators.required,]],
      phoneNumber: [null, [Validators.required, Validators.minLength(10),Validators.pattern(/(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/),]],
      personalCountryId: [null, [Validators.required,Validators.minLength(8),Validators.pattern(/^[0-9]\d*$/),]],
      organizationId: [null, Validators.required],
      streetBirthPlace: [{value:null, disabled : true}, Validators.required],
      countryBirthPlace: [this.countryBirthPlace[0].countryId,Validators.required],
      provinceBirthPlace: [null, Validators.required],
      districtBirthPlace: [{value:null, disabled : true}, Validators.required],
      communeBirthPlace: [{value:null, disabled : true}, Validators.required],
      homeNumberBirthPlace: [{value:null, disabled : true}, Validators.required],
      countryResidencePlace: [this.countryResidencePlace[0].countryId,Validators.required],
      provinceResidencePlace: [null, Validators.required],
      districtResidencePlace: [{value:null, disabled : true}, Validators.required],
      communeResidencePlace: [{value:null, disabled : true}, Validators.required],
      streetResidencePlace: [{value:null, disabled : true}, Validators.required],
      homeNumberResidencePlace: [{value:null, disabled : true}, Validators.required],
      gender: [null, [Validators.required]],
      birthday: [null, [Validators.required, Validators.minLength(22)]],
      email: [null, [Validators.required, Validators.email,]],
    });

    this.initAddress();
    this.getOrganizationId();
  }

getOrganizationId(){
  this._personalService
    .getOrganizationId()
    .subscribe((res) => {
      this.organizationId = res.data
      console.log(res)

      
    }); 
}

selectOrganization(e){
  this.newPersonal.controls['organizationId'].setValue(e.organizationId);       
}
 randomUser(length) {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
    result += characters.charAt(Math.floor(Math.random() * 
charactersLength));
 }
 return this.newPersonal.controls['username'].setValue(result);
}
initAddress() {
    this._addressService
      .getProvince()
      .pipe(
        map((res) => {
          console.log(res);
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
        console.log(this.provinceResidencePlace)
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
              .getDistrict(this.newPersonal.get('provinceResidencePlace').value)
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
              .getDistrict(this.newPersonal.get('provinceBirthPlace').value)
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
                this.districtResidencePlace =res;
                console.log(res);
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
              .getCommune(this.newPersonal.get('districtResidencePlace').value)
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
              .getCommune(this.newPersonal.get('districtBirthPlace').value)
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
                this.communeResidencePlace =res;
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
              .getStreet(this.newPersonal.get('communeResidencePlace').value)
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
              .getStreet(this.newPersonal.get('communeBirthPlace').value)
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
                this.streetResidencePlace =res;
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
      if(this.checkStreet === false){
        this.newPersonal.get('districtResidencePlace').enable();
        this.newPersonal.get('communeResidencePlace').enable();
        this.newPersonal.get('streetResidencePlace').enable();
        this.newPersonal.get('homeNumberResidencePlace').enable();
        this.newPersonal.patchValue({
          provinceResidencePlace : this.newPersonal.get('provinceBirthPlace').value,
          districtResidencePlace : this.newPersonal.get('districtBirthPlace').value,
          communeResidencePlace : this.newPersonal.get('communeBirthPlace').value, 
          streetResidencePlace : this.newPersonal.get('streetBirthPlace').value, 
          homeNumberResidencePlace:null,
        })
        this.checkStreet = true;
        console.log(this.newPersonal.get('districtResidencePlace').value);
      }
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
        ;
      const body = {
        streetName: streetName,
        streetType: "Đường",
        communeId: communeId,
      };
      this._addressService.createStreet(body).subscribe((res) => {
        this.streetResidencePlace = [...this.streetResidencePlace, res.data];
        if(this.newPersonal.get("communeBirthPlace").value!=null&&communeId==this.newPersonal.get("communeBirthPlace").value){
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
        this.newPersonal.get("communeBirthPlace").value;
      const body = {
        streetName: streetName,
        streetType: "Đường",
        communeId: communeId,
      };
      //Tạo dữ liệu đường mới lấy từ dữ liệu phường xã đã select
      this._addressService.createStreet(body).subscribe((res) => {
        //Cập nhật state do khi lưu dữ liệu lên server nhưng select không cập nhật dữ liệu mới
        this.streetBirthPlace = [...this.streetBirthPlace, res.data];
        this.streetResidencePlace = [...this.streetBirthPlace, res.data];
        if(this.newPersonal.get("communeResidencePlace").value!=null&&communeId==this.newPersonal.get("communeResidencePlace").value){
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
getHomeBirthDay(event){
  console.log(event.target.value)
  this.newPersonal.get("homeNumberResidencePlace").setValue(this.newPersonal.get('homeNumberBirthPlace').value);
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
  showGlobalOverlay() {
    const overlayRef = this.overlay.create({
      positionStrategy: this.overlay.position().global().centerHorizontally().centerVertically(),
      hasBackdrop: true
    });
    // overlayRef.attach(new ComponentPortal(ProgressContainerComponent))
  }
  onSubmit() {
    this.randomUser(5);
    let data = this.newPersonal.value
    console.log(data);
    
    this.submitted = true;
    this.showGlobalOverlay();
    // stop here if form is invalid
    if (this.newPersonal.invalid) {
      return;
    }
    
    
    const newPersonal = JSON.stringify(data);
    
    this._personalService.submitForm(newPersonal).subscribe((res: any) => {
      console.log(res)
      
      if (res.result === true) {
        this.updateTable();
        this.toggleSidebar();
        this._toastrService.success(
          "Đăng ký thuê bao cá nhân thành công ",
          "Thành công",
          { 
            toastClass: "toast ngx-toastr",
            positionClass: "toast-top-center", closeButton: true }
        );
      }
      if(res.result === false){
        this._toastrService.error(
          "Email này đã tồn tại",
          "Thất Bại",
          { toastClass: "toast ngx-toastr", closeButton: true }
        );
      }
    });
    // console.log(newPersonal);
    // const option = {
    //   headers: {
    //     "Content-Type": "application/json",
    //     Authorization: "Bearer " + token,
    //   },
    // };
    // dispbirthdayay form values on success
    // return this._httpClient
    //   .post<any>(`${environment.apiUrl}/personal/create`, newPersonal, option)
    //   .subscribe((respon: any) => {
    //     if ((respon.result = "true")) {
    //       this.toggleSidebar();
    //       this.updateTable();
    //     }
    //   });
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
