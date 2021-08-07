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
  selector: 'app-new-personal-sidebar',
  templateUrl: './new-personal-sidebar.component.html',
  styleUrls: ['./new-personal-sidebar.component.scss']
})
export class NewPersonalSidebarComponent implements OnInit {
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
  
  newPersonal: FormGroup;

  constructor(
    private _coreSidebarService: CoreSidebarService,
    private fb: FormBuilder
  ) { }
  submitted = false;
  ngOnInit(): void {
    
    this.newPersonal = this.fb.group({
      personalFirstName: ['', [Validators.required,Validators.minLength(6)]],
      personalMiddleName: ['', Validators.required],
      personalLastName: ['', Validators.required],
      phoneNumber: ['',Validators.required,,Validators.minLength(10)],
      personalCountryId: ['',Validators.required],
      organizationId: ['',Validators.required],
      streetBirthplace: ['',Validators.required],
      homeNumberBirthPlace: ['',Validators.required],
      streetResidencePlace: ['',Validators.required],
      homeNumberResidencePlace: ['',Validators.required],
      // validates date format yyyy-mm-dd
      birthday: ['', [Validators.required, Validators.pattern(/^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/)]],
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
  }
  get f() { return this.newPersonal.controls; }
  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.newPersonal.invalid) {
        return;
    }

    // display form values on success
    alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.newPersonal.value, null, 4));
  }
  toggleSidebar(name): void {
    this._coreSidebarService.getSidebarRegistry(name).toggleOpen();
  }
  
  
}
