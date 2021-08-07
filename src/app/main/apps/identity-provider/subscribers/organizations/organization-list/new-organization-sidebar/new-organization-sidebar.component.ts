import { Component, OnInit } from '@angular/core';
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
@Component({
  selector: 'app-new-organization-sidebar',
  templateUrl: './new-organization-sidebar.component.html',
  styleUrls: ['./new-organization-sidebar.component.scss']
})
export class NewOrganizationSidebarComponent implements OnInit {

  public fullname;
  public username;
  public email;
  countryBirthPlace:String[] =[
    'Việt Nam',
    'Thái Lan',
    'Lào',
  ]
  provinceBirthPlace:String[] =[
    'Hà Nam',
    'Thài Bình ',
    'Nam Định',
  ]
  districtBirthPlace:String[] =[
    'Lý Nhân',
    'Bình Lục',
    'Thanh Liêm',
  ]
  communeBirthPlace:String[] =[
    'Nhân Nghĩa',
    'Nhân Bình',
    'Xuân Khê',
  ]


  countryResidencePlace:String[] =[
    'Việt Nam',
    'Thái Lan',
    'Lào',
  ]
  provinceResidencePlace:String[] =[
    'Hà Nam',
    'Thài Bình ',
    'Nam Định',
  ]
  districtResidencePlace:String[] =[
    'Lý Nhân',
    'Bình Lục',
    'Thanh Liêm',
  ]
  communeResidencePlace:String[] =[
    'Nhân Nghĩa',
    'Nhân Bình',
    'Xuân Khê',
  ]
  newOganization: FormGroup;
  constructor(
      private _coreSidebarService: CoreSidebarService,
      private fb: FormBuilder
      ) { }

  ngOnInit(): void {
    this.newOganization = this.fb.group({
      // id quốc gia tổ chức
      countryOrganizationId: [
        "",
        Validators.compose([
          Validators.required,
          Validators.minLength(10),
        ])
      ],
      // tên tổ chức
      organizationName: [
        "",
        Validators.compose([
          Validators.required,
          Validators.minLength(2),
        ])
      ],
      // id tổ chức mẹ
      parentOrganizationId: [
        "",
        Validators.compose([
          Validators.required,
          Validators.minLength(2),
          Validators.pattern('^[0-9]')
        ])
      ],
      // id loại người đăng ký
      subscriberCategoryId:[
        "",
        Validators.compose([
          Validators.required,
          Validators.minLength(12),
          Validators.pattern('^[0-9]')
        ])
      ],
      // tên nhóm trưởng
      leaderName: [
        "",
        Validators.compose([
          Validators.required,
          
        ])
      ],
      // webside
      website: [
        "",
        Validators.compose([
          Validators.required,
          
        ])
      ],
      
      // số điện thoại
      phoneNumber: [
        "",
        Validators.compose([
          Validators.required,
          Validators.pattern(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/),
          Validators.email
        ])
      ],
      // số nhà
      homeNumber: [
        "",
        Validators.compose([
          Validators.required,
          
          
        ])
      ],
      // địa chỉ cụ thể
      street: [
        "",
        Validators.compose([
          Validators.required,
          
          
        ])
      ],
      
    }),
    new FormControl("", Validators.required, this.isUserNameDuplicated);
  }
  isUserNameDuplicated(control: AbstractControl): Observable<ValidationErrors> {
    return of(null);
  }
  toggleSidebar(name): void {
    this._coreSidebarService.getSidebarRegistry(name).toggleOpen();
  }
  closeSidebar() {
    this.toggleSidebar('new-organizarion-sidebar');
  }
  submit(form) {
    console.log(this.newOganization)
  }

}
