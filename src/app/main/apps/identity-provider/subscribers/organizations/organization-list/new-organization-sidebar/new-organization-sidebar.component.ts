import { Component, OnInit } from '@angular/core';
import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';
import { Commune, District, Province, Street } from "app/main/models/Address";
import { AddressService } from "app/main/apps/identity-provider/address.service";
import { map, takeUntil } from "rxjs/operators";
import {  Subject } from "rxjs";
import { ToastrService } from "ngx-toastr";

import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
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

  public submitted = false;
  private _unsubscribeAll = new Subject();
  country:any[] =[
    {
      countryId: 237,
      countryName: "Việt Nam",
      countryCode: "VN",
      countryType: "Independent State",
    },
  ]
  province: Province[];
  district: District[];
  commune: Commune[];
  street: Street[];
  
  newOganization: FormGroup;
  constructor(
      private _coreSidebarService: CoreSidebarService,
      private fb: FormBuilder,
      private _addressService: AddressService,
      private modalService: NgbModal,
      private _toastrService: ToastrService,

      ) {}
  ngOnInit(): void {
    this.newOganization = this.fb.group({
      countryOrganizationId: ['',Validators.required],
      organizationName: ['',Validators.required],
      parentOrganizationId: ['',Validators.required],
      subscriberCategoryId: ['',Validators.required],
      leaderName: ['',Validators.required],
      website: ['',Validators.required],
      email: ['',Validators.required],
      phoneNumber: ['',Validators.required],
      street: [{value:null, disabled : true},Validators.required],
      country: [null,Validators.required],
      province: [null,Validators.required],
      district: [{value:null, disabled : true},Validators.required],
      commune: [{value:null, disabled : true},Validators.required],
      descriptionHome: [{value:null, disabled : true},Validators.required],      
    });
    this.initAddress()
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
          descriptionHome:null,
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
          descriptionHome:null,
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
          descriptionHome:null,
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
      descriptionHome:null,
    })
    this.newOganization.get('descriptionHome').enable();
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
  toggleSidebar(name): void {
    this._coreSidebarService.getSidebarRegistry(name).toggleOpen();
  }
  closeSidebar() {
    this.toggleSidebar('new-organizarion-sidebar');
  }
  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.newOganization.invalid) {
        return;
    }

    // display form values on success
    alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.newOganization.value, null, 4));
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
