import { Component, OnInit } from '@angular/core';
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

  public idDistrict:number = 1
  public idProvice:number = 1

  public idDistrictPlace:number = 1
  public idProvicePlace:number = 1

  public provinceBirth:any
  public districtBirth:any
  public communeBirth:any
  public provinceResidence:any
  public districtResidence:any
  public communeResidence:any
  // birth place
  countryBirthPlace:String[] =[
    'Việt Nam',
    
  ]
  provinceBirthPlace:String[] =[
    
  ]
  districtBirthPlace:String[] =[
    
  ]
  communeBirthPlace:String[] =[
  ]
  homeNumberBirthPlace:String[]=[
    'ĐIện Biên Phủ',
    'Nguyễn Khuyến',
    'Tố Hữu'
  ]
// residence place
  countryResidencePlace:String[] =[
    'Việt Nam',
  ]
  provinceResidencePlace:String[] =[
    
  ]
  districtResidencePlace:String[] =[
    
  ]
  communeResidencePlace:String[] =[
  ]
  homeNumberResidencePlace:String[]=[
    'ĐIện Biên Phủ',
    'Nguyễn Khuyến',
    'Tố Hữu'
  ]
  
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
  toggleSidebar(name){
    console.log(name)
    this._coreSidebarService.removeSidebarRegistry(name)
    // console.log('test exit')
    // this.modalService.dismissAll();
  }
  submitted = false;
  ngOnInit(): void {
    
    this.newPersonal = this.fb.group({
      personalFirstName: ['', [Validators.required,Validators.minLength(6)]],
      personalMiddleName: ['', Validators.required],
      personalLastName: ['', Validators.required],
      phoneNumber: ['',Validators.required,,Validators.minLength(10)],
      personalCountryId: ['',Validators.required],
      organizationId: ['',Validators.required],
      streetBirthPlace: ['',Validators.required],
      homeNumberBirthPlace: ['',Validators.required],
      streetResidencePlace: ['',Validators.required],
      homeNumberResidencePlace: ['',Validators.required],
      // validates date format yyyy-mm-dd
      // birthday: ['', [Validators.required, Validators.pattern(/^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/)]],

      birthday: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      countryBirthPlace: ['',Validators.required],
      provinceBirthPlace: ['',Validators.required],
      districtBirthPlace: ['',Validators.required],
      communeBirthPlace: ['',Validators.required],
      countryResidencePlace: ['',Validators.required],
      provinceResidencePlace: ['',Validators.required],
      districtResidencePlace: ['',Validators.required],
      communeResidencePlace: ['',Validators.required],
      
    });
    new FormControl("", Validators.required, this.isUserNameDuplicated);
    this.getProviceBirth()
    this.getDistrictBirth()
    this.getCommuneBirth()
    this.getProviceResidence()
    this.getDistrictResidence()
    this.getCommuneResidence()
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
      headers :{
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token,
        
      }
    }
    // display form values on success
    
    return this._httpClient.post<any>(`${environment.apiUrl}/personal/create`,newPersonal,option).subscribe((respon:any)=>(
      console.log('respon',respon)
      // this.toggleSidebar()
       )
    )
    
  }
  close(){
    this.modalService.dismissAll()
  }
  // set address birth
  selectProviceBirth(e){
    console.log(e.target.value)
    const add = ' '
    const provice = this.provinceBirth.find((province,index) => province.provinceType.concat(add,province.provinceName) === e.target.value )
    console.log(provice)
    this.idProvice= provice.provinceId
    
    this.getDistrictBirth()
    this.getCommuneBirth()
    
  }
  selectDistrictBirth(e){
    const add = ' '
    const district = this.districtBirth.find((district,index) => district.districtType.concat(add,district.districtName) == e.target.value)
    this.idDistrict = district.districtId
    this.getCommuneBirth()
  }

  getProviceBirth(){
    const currentUser = JSON.parse(localStorage.getItem('currentUser'))
    const token = currentUser.token
    const option = {
      headers :{
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token,
      }
    }
    this._httpClient.get<any>(`${environment.apiUrl}/address/province/list/237`,option).subscribe((respon:any) =>{ 
      this.provinceBirth= respon.data
      console.log("các tỉnh ",this.provinceBirth)
        respon.data.map((item,index) =>{
          return this.provinceBirthPlace.push(item.provinceType+' '+item.provinceName)
        })
      }
    )

  }
  getDistrictBirth(){
    const currentUser = JSON.parse(localStorage.getItem('currentUser'))
    const token = currentUser.token
    const option = {
      headers :{
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token,
      }
    }
    // this.districtBirthPlace=[]
    this._httpClient.get<any>(`${environment.apiUrl}/address/district/list/${this.idProvice}`,option).subscribe((respon:any) =>{
      this.districtBirth = respon.data
      // console.log(this.districtBirth)
      this.idDistrict = this.districtBirth[0].districtId
      console.log('id huyện đầu tiên ', this.idDistrict)
      this.districtBirthPlace=[]
      respon.data.map((item) =>{
        return this.districtBirthPlace.push(item.districtType+' '+item.districtName)
      })
      // console.log("huyện mới ",this.districtBirthPlace)
      
      }
    )

  }
  getCommuneBirth(){
    const currentUser = JSON.parse(localStorage.getItem('currentUser'))
    const token = currentUser.token
    const option = {
      headers :{
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token,
      }
    }
    console.log(this.idDistrict)
    this._httpClient.get<any>(`${environment.apiUrl}/address/commune/list/${this.idDistrict}`,option).subscribe((respon:any) =>{
      // console.log("dữ liệu xã khi chưa xã",respon.data)
      // this.idDistrict = 0
      this.communeBirthPlace = []
      respon.data.map((item) =>{
        return this.communeBirthPlace.push(item.communeType+ ' '+item.communeName)
      })
      // console.log(respon.data[1])
      
    }
    )
  }

  // set address residence

  selectProvinceResidence(e){
    const add = ' '
    const provice = this.provinceResidence.find((province,index) => province.provinceType.concat(add,province.provinceName) === e.target.value)
    this.idDistrictPlace = provice.provinceId
    console.log(this.idDistrictPlace)
    this.getDistrictResidence()
    this.getCommuneResidence()
  }
  selectDistrictResidence(e){
    console.log(this.districtResidence)
    console.log(e.target.value)
    const add = ' '
    const district = this.districtResidence.find((district,index) => district.districtType.concat(add,district.districtName) == e.target.value)
    // this.idDistrict = district.districtId
    this.getCommuneResidence()
  }
  
  getProviceResidence(){
    const currentUser = JSON.parse(localStorage.getItem('currentUser'))
    const token = currentUser.token
    const option = {
      headers :{
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token,
      }
    }
    this._httpClient.get<any>(`${environment.apiUrl}/address/province/list/237`,option).subscribe((respon:any) =>{ 
      this.provinceResidence= respon.data
      // console.log("các tỉnh ",this.provinceBirth)
        respon.data.map((item,index) =>{
          return this.provinceResidencePlace.push(item.provinceType+' '+item.provinceName)
        })
      }
    )

  }
  getDistrictResidence(){
    const currentUser = JSON.parse(localStorage.getItem('currentUser'))
    const token = currentUser.token
    const option = {
      headers :{
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token,
      }
    }
    this._httpClient.get<any>(`${environment.apiUrl}/address/district/list/${this.idDistrictPlace}`,option).subscribe((respon:any) =>{
      this.districtResidence = respon.data
      // console.log(this.districtBirth)
      this.idDistrictPlace = respon.data[0].districtId
      // console.log('các huyện sau khi đổi ', this.districtBirth)
      // this.districtBirthPlace=[]
      this.districtResidencePlace = []
      respon.data.map((item) =>{
        return this.districtResidencePlace.push(item.districtType+' '+item.districtName)
      })
      // console.log("huyện mới ",this.districtBirthPlace)
      
      }
    )

  }
  getCommuneResidence(){
    const currentUser = JSON.parse(localStorage.getItem('currentUser'))
    const token = currentUser.token
    const option = {
      headers :{
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token,
      }
    }
    this._httpClient.get<any>(`${environment.apiUrl}/address/commune/list/${this.idDistrictPlace}`,option).subscribe((respon:any) =>{
      // console.log("dữ liệu xã khi chưa xã",respon.data)
      // this.idDistrictPlace = 0
      this.communeResidencePlace = []
      respon.data.map((item) =>{
        return this.communeResidencePlace.push(item.communeType+ ' '+item.communeName)
      })
      // console.log(respon.data[1])
      
    }
    )
  }

  

  

  
  
}
