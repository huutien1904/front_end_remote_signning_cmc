import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators
} from "@angular/forms";
import { Observable, of } from "rxjs";
import { environment } from 'environments/environment';

@Component({
  selector: 'app-new-personal-sidebar',
  templateUrl: './new-personal-sidebar.component.html',
  styleUrls: ['./new-personal-sidebar.component.scss']
})
export class NewPersonalSidebarComponent implements OnInit {
  public fullname;
  public username;
  public email;

  public idDistrictBirth: number
  public idProviceBirth: number

  public idDistrictPlace: number
  public idProvicePlace: number = 1

  public provinceBirth: any
  public districtBirth: any
  public communeBirth: any
  public provinceResidence: any
  public districtResidence: any
  public communeResidence: any
  public submitted = false;
  // birth place
  public countryBirthPlace: any[] = [
   {name: "Việt Nam"},
    {name:"Thái Lan"},
    {name:"CamPuchia"},
  ]
  provinceBirthPlace: any[] = [

  ]
  districtBirthPlace: String[] = [

  ]
  communeBirthPlace: String[] = [
  ]
  homeNumberBirthPlace: any[] = [
    {name: "ĐIện Biên Phủ"},
    {name:"Nguyễn Khuyến"},
    {name:"Tố Hữu"},
  ]
  // residence place
  countryResidencePlace: any[] = [
    {name:"Việt Nam"}
  ]
  provinceResidencePlace: String[] = [

  ]
  districtResidencePlace: String[] = [

  ]
  communeResidencePlace: String[] = [
  ]
  homeNumberResidencePlace: any[] = [
    {name: "ĐIện Biên Phủ"},
    {name:"Nguyễn Khuyến"},
    {name:"Tố Hữu"},
  ]
  @Output() onClose = new EventEmitter<any>();
  @Output() onUpdate = new EventEmitter<any>();
  newPersonal: FormGroup;
  /**
    *' Constructor
    *
    * @param {NgbModal} modalService
    * @param {HttpClient} _httpClient
    */
  constructor(
    private _coreSidebarService: CoreSidebarService,
    private _httpClient: HttpClient,
    private fb: FormBuilder,
    private modalService: NgbModal,
  ) {
  }
  toggleSidebar() {
    this.modalService.dismissAll();
  }

  ngOnInit(): void {
    this.newPersonal = this.fb.group({
      personalFirstName: ['', [Validators.required, Validators.minLength(6)]],
      personalMiddleName: ['', Validators.required],
      personalLastName: ['', Validators.required],
      phoneNumber: ['', Validators.required, , Validators.minLength(10)],
      personalCountryId: ['', Validators.required],
      organizationId: ['', Validators.required],
      streetBirthPlace: ['', Validators.required],
      homeNumberBirthPlace: [this.homeNumberBirthPlace, Validators.required],
      streetResidencePlace: ['', Validators.required],
      homeNumberResidencePlace: [this.homeNumberResidencePlace, Validators.required],
      // validates date format yyyy-mm-dd
      // birthday: ['', [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)\d{2}$/)]],

      birthday: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      countryBirthPlace: [this.countryBirthPlace, Validators.required],
      provinceBirthPlace: [this.provinceBirthPlace, Validators.required],
      districtBirthPlace: [this.districtBirthPlace, Validators.required],
      communeBirthPlace: [this.communeBirthPlace, Validators.required],
      countryResidencePlace: [this.countryResidencePlace, Validators.required],
      provinceResidencePlace: [this.provinceResidencePlace, Validators.required],
      districtResidencePlace: [this.districtResidencePlace, Validators.required],
      communeResidencePlace: [this.communeResidencePlace, Validators.required],

    });
    this.getProvice(237,3)
    this.getDistrict(this.idProviceBirth,3)
  }
  changeCryptoSystemName(e) {
    console.log(e)
    this.newPersonal.get("provinceBirthPlace").setValue("1");

  };
  closeModal() {
    this.onClose.emit();
  }
  updateTable() {
    this.onUpdate.emit()
  }
  isUserNameDuplicated(control: AbstractControl): Observable<ValidationErrors> {
    return of(null);
  }
  get f() { return this.newPersonal.controls; }

  onSubmit() {
    this.submitted = true;
    const currentUser = JSON.parse(localStorage.getItem('currentUser'))
    const token = currentUser.token

    // stop here if form is invalid
    if (this.newPersonal.invalid) {
      return;
    }
    const newPersonal = JSON.stringify(this.newPersonal.value)
    console.log(newPersonal)
    const option = {
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token,

      }
    }
    // display form values on success

    return this._httpClient.post<any>(`${environment.apiUrl}/personal/create`, newPersonal, option).subscribe((respon: any) => {
      console.log(respon)
      if (respon.result = "true") {
        this.closeModal()
        this.updateTable()
      }
    }
    )

  }
  // set address birth
  OnSelectProviceBirth(e){
    this.getDistrict(e.id,1)
  }
  OnSelectDistrictBirth(e){
    this.getCommune(e.id,1)
  }
  OnSelectProviceResidence(e){
    this.getDistrict(e.id,2)
  }
  OnSelectDistrictResidence(e){
    this.getCommune(e.id,2)
  }
  getProvice(idCountry,x) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'))
    const token = currentUser.token
    const option = {
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token,
      }
    }
    this._httpClient.get<any>(`${environment.apiUrl}/address/province/list/${idCountry}`, option).subscribe((respon: any) => {
      if(x===1){
        this.idProviceBirth = respon.data[0].provinceId
        this.getDistrict(respon.data[0].provinceId,1)
        this.provinceBirthPlace = respon.data.map(item=>({
          id: item.provinceId,
          name:item.provinceType +" "+ item.provinceName
        }))
      }
      if(x===2){
        this.idProviceBirth = respon.data[0].provinceId
        this.getDistrict(respon.data[0].provinceId,2)
        this.provinceResidencePlace = respon.data.map(item=>({
          id: item.provinceId,
          name:item.provinceType +" "+ item.provinceName
        }))
      }
      if(x===3){
        console.log(respon.data)
        this.idProviceBirth = respon.data[0].provinceId
        this.getDistrict(respon.data[0].provinceId,3)
        this.provinceBirthPlace = respon.data.map(item=>({
          id: item.provinceId,
          name:item.provinceType +" "+ item.provinceName
        }))
        console.log()
        this.provinceResidencePlace = this.provinceBirthPlace
      }
      
    }
    )
    
  }
  getDistrict(idProvice,x) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'))
    const token = currentUser.token
    const option = {
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token,
      }
    }
    // this.districtBirthPlace=[]
    this._httpClient.get<any>(`${environment.apiUrl}/address/district/list/${idProvice}`, option).subscribe((respon: any) => {
      if(x===1){
        this.getCommune(respon.data[0].districtId,1)

        this.districtBirthPlace = respon.data.map((item) =>({
          id:item.districtId,
          name:item.districtType + " " + item.districtName
        }))
      }
      if(x===2){
        this.getCommune(respon.data[0].districtId,2)

        this.districtResidencePlace = respon.data.map((item) =>({
          id:item.districtId,
          name:item.districtType + " " + item.districtName
        }))
      }
      if(x===3){
        this.getCommune(respon.data[0].districtId,1)
  
        this.districtBirthPlace = respon.data.map((item) =>({
          id:item.districtId,
          name:item.districtType + " " + item.districtName
        }))
        this.districtResidencePlace = this.districtBirthPlace
      }
    }
    )
  }
  getCommune(idDistrict,x) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'))
    const token = currentUser.token
    const option = {
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token,
      }
    }
    this._httpClient.get<any>(`${environment.apiUrl}/address/commune/list/${idDistrict}`, option).subscribe((respon: any) => {
      if(x===1){
        this.communeBirthPlace = respon.data.map((item) =>({
          id:item.communeId,
          name:item.communeType + " " +item.communeName
        }))
      }
      if(x===2){
        this.communeResidencePlace = respon.data.map((item) =>({
          id:item.communeId,
          name:item.communeType + " " +item.communeName
        }))
      }
      if(x===3){
        this.communeBirthPlace = respon.data.map((item) =>({
          id:item.communeId,
          name:item.communeType + " " +item.communeName
        }))
        this.communeResidencePlace = this.communeBirthPlace
      }
    }
    )
  }

  








}
