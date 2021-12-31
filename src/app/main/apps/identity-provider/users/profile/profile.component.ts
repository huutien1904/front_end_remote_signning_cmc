import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { Personal } from 'app/main/models/Personal';
import { ProfileService } from './profile.service';
import { User } from 'app/auth/models';
import { AuthenticationService } from 'app/auth/service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ProfileComponent implements OnInit {
  minDate: Date;
  maxDate: Date;
  public rows;
  public tempRow;
  public personalInfo = new Personal();
  public endProfileName: string;
  public currentUser: User;
  public url = this.router.url;
  public organizationId: any[] = [];
  public phoneNumber = [''];
  public countryResidencePlace = [
    {
      countryId: '237',
      countryName: 'Việt Nam',
      countryCode: 'VN',
      countryType: 'Independent State',
    },
  ];
  public countryBirthPlace: any[] = [
    {
      countryId: '237',
      countryName: 'Việt Nam',
      countryCode: 'VN',
      countryType: 'Independent State',
    },
  ];

  avatarImage = 'assets/images/portrait/small/avatar-s-11.jpg';
  // public avatarImage: string ;
  @ViewChild('accountForm') accountForm: NgForm;
  formProfile: FormGroup;
  formInfoEdit: FormGroup;
  private _unsubscribeAll = new Subject();

  constructor(
    private dateAdapter: DateAdapter<any>,
    // private _authenticationService: AuthenticationService
    private _profileService: ProfileService,
    private fb: FormBuilder,
    private router: Router
  ) {
    const currentYear = new Date().getFullYear();
    this.minDate = new Date(currentYear - 4, 0, 1);
    this.maxDate = new Date(currentYear + 2, 11, 31);
    // this._profileService.currentUser.subscribe(
    //   (x) => (this.currentUser = x)
    // );
  }
  async ngOnInit() {
    await this._profileService
      .getPersonalById()
      .toPromise()
      .then((data) => {
        this.personalInfo = data.data;
        console.log(data);
      });
    this.formProfile = this.fb.group({
      personalFirstName: [''],
      personalMiddleName: [''],
      personalLastName: [''],
    });
    this.formInfoEdit = this.fb.group({
      personalFirstName: [{ value: null, disabled: true }],
      personalMiddleName: [{ value: null, disabled: true }],
      personalLastName: [{ value: null, disabled: true }],
      username: ['', [Validators.required]],
      subscriberCategoryId: [
        { value: null, disabled: true },
        [Validators.required],
      ],
      firstName: [{ value: null, disabled: true }, [Validators.required]],
      middleName: [{ value: null, disabled: true }, [Validators.required]],
      lastName: [{ value: null, disabled: true }, [Validators.required]],
      phoneNumber: [
        { value: null, disabled: true },
        [
          Validators.required,
          Validators.minLength(10),
          Validators.pattern(/(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/),
        ],
      ],
      personalCountryId: [
        { value: null, disabled: true },
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(/^[0-9]\d*$/),
        ],
      ],
      organizationId: [null, Validators.required],
      streetBirthPlace: [{ value: null, disabled: true }, Validators.required],
      countryBirthPlace: [
        // this.countryBirthPlace[0].countryId,
        { value: null, disabled: true },
        Validators.required,
      ],
      provinceBirthPlace: [{ value: null, disabled: true }, Validators.required],
      districtBirthPlace: [
        { value: null, disabled: true },
        Validators.required,
      ],
      communeBirthPlace: [{ value: null, disabled: true }, Validators.required],
      homeNumberBirthPlace: [
        { value: null, disabled: true },
        Validators.required,
      ],
      countryResidencePlace: [
        // this.countryResidencePlace[0].countryId,
        { value: null, disabled: true },
        Validators.required,
      ],
      provinceResidencePlace: [
        { value: null, disabled: true },
        Validators.required,
      ],
      districtResidencePlace: [
        { value: null, disabled: true },
        Validators.required,
      ],
      communeResidencePlace: [
        { value: null, disabled: true },
        Validators.required,
      ],
      streetResidencePlace: [
        { value: null, disabled: true },
        Validators.required,
      ],
      homeNumberResidencePlace: [
        { value: null, disabled: true },
        Validators.required,
      ],
      gender: [{ value: null, disabled: true }, [Validators.required]],
      birthday: [
        { value: null, disabled: true },
        [Validators.required, Validators.minLength(22)],
      ],
      email: [
        { value: null, disabled: true },
        [Validators.required, Validators.email],
      ],
    });

    this.getProfileData();
  }

  uploadImage(event: any) {
    if (event.target.files && event.target.files[0]) {
      let reader = new FileReader();
      reader.onload = (event: any) => {
        this.avatarImage = event.target.result;
      };

      reader.readAsDataURL(event.target.files[0]);
    }
  }

  getProfileData() {
    this._unsubscribeAll = new Subject();
    this._profileService.getPersonalById().subscribe((personal: any) => {
      const data = personal.data;
      const provinceBirthId = data.birthPlace.provinceId;
      const provinceResidenceId = data.address.provinceId;
      const districtBirthId = data.birthPlace.districtId;
      const districtResidenceId = data.address.districtId;
      const communeBirthId = data.birthPlace.communeId;
      const communeResidenceId = data.address.communeId;
      const streetBirthId = data.birthPlace.streetId;
      const streetResidenceId = data.address.streetId;
      console.log(data);
      this.formInfoEdit.controls['personalFirstName'].setValue(data.firstName);
      // this.formProfile.controls['personalFirstName'].setValue(data.firstName);
      this.formInfoEdit.controls['personalMiddleName'].setValue(
        data.middleName
      );
      this.formInfoEdit.controls['personalLastName'].setValue(data.lastName);
      this.formInfoEdit.controls['birthday'].setValue(data.birthday);
      this.formInfoEdit.controls['phoneNumber'].setValue(data.phoneNumber);
      this.formInfoEdit.controls['email'].setValue(data.email);
      this.formInfoEdit.controls['gender'].setValue(data.gender);
      this.formInfoEdit.controls['personalCountryId'].setValue(
        data.personalCountryId
      );
      this.formInfoEdit.controls['subscriberCategoryId'].setValue(
        data.subscriberCategoryName
      );
      this.formInfoEdit.controls['countryBirthPlace'].setValue(
        data.birthPlace.countryId
      );
      this.formInfoEdit.controls['countryResidencePlace'].setValue(
        data.address.countryId
      );
      this.formInfoEdit.controls['homeNumberBirthPlace'].setValue(data.birthPlace.houseNumber);
      this.formInfoEdit.controls['homeNumberResidencePlace'].setValue(data.address.houseNumber);

      console.log(districtBirthId);
      console.log(personal);
      this.getProviceBirth(provinceBirthId);
      this.getProvinceAddres(provinceResidenceId);
      this.getDistrictBirth(districtBirthId);
      this.getDistrictAddress(districtResidenceId);
      this.getCommuneBirth(communeBirthId);
      this.getCommuneAddress(communeResidenceId);
      this.getStreetBirth(streetBirthId);
      this.getStreetAddress(streetResidenceId);
    });
  }

  getProviceBirth(id) {
    this._profileService.getProviceById(id).subscribe((res) => {
      // console.log(res);
      const provinceBirthName = res.data.provinceName;
      this.formInfoEdit.controls['provinceBirthPlace'].setValue(
        provinceBirthName
      );
    });
  }
  getProvinceAddres(id) {
    this._profileService.getProviceById(id).subscribe((res) => {
      // console.log(res);
      const provinceResidenceName = res.data.provinceName;
      this.formInfoEdit.controls['provinceResidencePlace'].setValue(
        provinceResidenceName
      );
    });
  }
  getDistrictBirth(id) {
    this._profileService.getDistrictById(id).subscribe((res) => {
      // console.log(res);
      const districtBirthPlace = res.data.districtName;
      this.formInfoEdit.controls['districtBirthPlace'].setValue(
        districtBirthPlace
      );
    });
  }
  getDistrictAddress(id) {
    this._profileService.getDistrictById(id).subscribe((res) => {
      console.log(res);
      const districtResidencePlace = res.data.districtName;
      this.formInfoEdit.controls['districtResidencePlace'].setValue(
        districtResidencePlace
      );
    });
  }

  getCommuneBirth(id) {
    this._profileService.getCommuneById(id).subscribe((res) => {
      console.log(res);
      const communeBirthPlace = res.data.communeName;
      this.formInfoEdit.controls['communeBirthPlace'].setValue(
        communeBirthPlace
      );
    });
  }

  getCommuneAddress(id) {
    this._profileService.getCommuneById(id).subscribe((res) => {
      console.log(res);
      const communeResidencePlace = res.data.communeName;
      this.formInfoEdit.controls['communeResidencePlace'].setValue(
        communeResidencePlace
      );
    });
  }
  getStreetBirth(id) {
    this._profileService.getStreetById(id).subscribe((res) => {
      console.log(res);
      const streetBirthPlace = res.data.streetName;
      this.formInfoEdit.controls['streetBirthPlace'].setValue(
        streetBirthPlace
      );
    });
  }

  getStreetAddress(id) {
    this._profileService.getStreetById(id).subscribe((res) => {
      console.log(res);
      const streetResidencePlace = res.data.streetName;
      this.formInfoEdit.controls['streetResidencePlace'].setValue(
        streetResidencePlace
      );
    });
  }
  
  
}
