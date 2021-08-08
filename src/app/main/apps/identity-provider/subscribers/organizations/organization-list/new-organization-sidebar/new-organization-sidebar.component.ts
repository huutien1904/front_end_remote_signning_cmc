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
  submitted = false;
  ngOnInit(): void {
    
  

    this.newOganization = this.fb.group({
      
      countryOrganizationId: ['',Validators.required],
      organizationName: ['',Validators.required],
      parentOrganizationId: ['',Validators.required],
      subscriberCategoryId: ['',Validators.required],
      leaderName: ['',Validators.required],
      website: ['',Validators.required],
      phoneNumber: ['',Validators.required],
      homeNumber: ['',Validators.required],
      street: ['',Validators.required],
      country: ['',Validators.required],
      province: ['',Validators.required],
      district: ['',Validators.required],
      commune: ['',Validators.required],
      descriptionHome: ['',Validators.required],
      updatedAt: ['',Validators.required],
      
    });
    new FormControl("", Validators.required, this.isUserNameDuplicated);
  }
  
  isUserNameDuplicated(control: AbstractControl): Observable<ValidationErrors> {
    return of(null);
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

}
