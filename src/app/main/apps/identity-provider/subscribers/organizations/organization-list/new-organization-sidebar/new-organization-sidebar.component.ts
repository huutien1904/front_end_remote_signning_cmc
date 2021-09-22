import { Organization, OrganizationCategory } from './../../../../../../models/Organization';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';
import { Commune, District, Province, Street } from "app/main/models/Address";
import { AddressService } from "app/main/apps/identity-provider/address.service";
import { map, takeUntil } from "rxjs/operators";
import {  Subject } from "rxjs";
import { ToastrService } from "ngx-toastr";
import {OrganizationListService} from './../organization-list.service'
import {
  FormBuilder,
  FormGroup,
  Validators
} from "@angular/forms";
import { Observable, of } from "rxjs";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-new-organization-sidebar',
  templateUrl: './new-organization-sidebar.component.html',
  styleUrls: ['./new-organization-sidebar.component.scss']
})
export class NewOrganizationSidebarComponent implements OnInit {
  @Output() onUpdate = new EventEmitter<any>();
  public submitted = false;
  private _unsubscribeAll = new Subject();
  public organizationList:Organization[];
  public typeOrganization:OrganizationCategory[] ;
  public country:any[] =[
    {
      countryId: 237,
      countryName: "Việt Nam",
      countryCode: "VN",
      countryType: "Independent State",
    },
  ]

  public province: Province[];
  public district: District[];
  public commune: Commune[];
  public street: Street[];
  newOganization: FormGroup;
  constructor(
      private _coreSidebarService: CoreSidebarService,
      private fb: FormBuilder,
      private _addressService: AddressService,
      private modalService: NgbModal,
      private _toastrService: ToastrService,
      private _organizationListService :OrganizationListService
      ) {}
  ngOnInit(): void {
    this.newOganization = this.fb.group({
      countryOrganizationId: ['',Validators.required],
      organizationName: ['',Validators.required],
      parentOrganizationId: [null,Validators.required],
      subscriberCategoryId: [null,Validators.required],
      leaderName: ['',Validators.required],
      website: ['',Validators.required],
      email: ['',Validators.required],
      phoneNumber: ['',Validators.required],
      street: [{value:null, disabled : true},Validators.required],
      country: [null,Validators.required],
      province: [null,Validators.required],
      district: [{value:null, disabled : true},Validators.required],
      commune: [{value:null, disabled : true},Validators.required],
      homeNumber: [{value:null, disabled : true},Validators.required],      
    });
    this.initAddress();
    this.getListOrganizations();
    this.getListTypeOrganization();
  }
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
        this.province = res;
        console.log(this.province)
      }); 
  }
  selectProvince(){
        this.newOganization.patchValue({
          district : null,
          commune : null, 
          street : null, 
          homeNumber:null,
        })
        this._addressService
                .getDistrict(this.newOganization.get('province').value)
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
                  this.district =res;
                  this.newOganization.get('district').enable();
                })
  }
  selectDistrict(){
        this.newOganization.patchValue({
          commune : null, 
          street : null, 
          homeNumber:null,
        })
        this._addressService
                .getCommune(this.newOganization.get('district').value)
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
                  this.commune =res;
                  this.newOganization.get('commune').enable();
                })
  }
  selectCommune(){
        this.newOganization.patchValue({
          street : null, 
          homeNumber:null,
        })
        this._addressService
                .getStreet(this.newOganization.get('commune').value)
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
                  this.street =res;
                  this.newOganization.get('street').enable();
                });
  }
  selectStreet(){
    this.newOganization.patchValue({
      homeNumber:null,
    })
    this.newOganization.get('homeNumber').enable();
  }
  modalOpenCreateStreet(modalSuccess) {
    this.modalService.open(modalSuccess, {
      centered: true,
      windowClass: "modal modal-success",
    });
  }
  onSubmitCreateStreet( streetName) {     
        const communeId = this.newOganization.get("commune").value;
        const body = {
          streetName: streetName,
          streetType: "Đường",
          communeId: communeId,
        };
        this._addressService.createStreet(body).subscribe((res) => {
          this.street = [...this.street, res.data];
          if(this.newOganization.get("commune").value!=null&&communeId==this.newOganization.get("commune").value){
            this.street = [...this.street, res.data];
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
  get f() { return this.newOganization.controls; }

  toggleSidebar() {
    this.modalService.dismissAll();
  }
  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.newOganization.invalid) {
        return;
    }
    const newOrganization = JSON.stringify(this.newOganization.value);
    console.log(this.newOganization.value);
    this._organizationListService.submitForm(newOrganization).subscribe((res: any) => {
      console.log(res)
      if ((res.result = "true")) {
        this.onUpdate.emit();
        this.toggleSidebar();
        this._toastrService.success(
          "Đăng ký thuê bao tổ chức thành công ",
          "Thành công",
          { toastClass: "toast ngx-toastr", closeButton: true }
        );
      }
    });  
  }
  getListOrganizations(){
    this._organizationListService
    .getListSelectOrganization()
    .pipe(
      map((res) => {
        const data = res.data.data.map((Organization) => ({
          ...Organization,
          // subscriberCategory: Organization.subscriberCategory.subscriberCategoryId
        }));
        return data;
      }),
      takeUntil(this._unsubscribeAll)
    )
    .subscribe((res) => {
      this.organizationList = res
      console.log(this.organizationList)
      
    }); 
  }
  getListTypeOrganization(){
    this._organizationListService
      .getListOrganizationCategory()
      .subscribe((res) => {
        res.data.forEach(function(item, index){
          if(item.subscriberCategoryName === "Cá nhân"){
            res.data.splice(index, 1);
          }
       });
        this.typeOrganization = res.data
        
      })
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
