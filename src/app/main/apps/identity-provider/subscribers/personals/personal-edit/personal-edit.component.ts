import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { PersonalListService } from '../personal-list/personal-list.service';
import { PersonalEditService } from './personal-edit.service';

@Component({
  selector: 'app-personal-edit',
  templateUrl: './personal-edit.component.html',
  styleUrls: ['./personal-edit.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class PersonalEditComponent implements OnInit {

  formPersonalEdit: FormGroup;
  public contentHeader: object;
  public url = this.router.url;
  public lastValue;
  private _unsubscribeAll: Subject<any>;
  public organizationId: any[] = [];
  public countryBirthPlace: any[] = [
    {
      countryId: 237,
      countryName: "Việt Nam",
      countryCode: "VN",
      countryType: "Independent State",
    },
  ];
  public selectBasic:any = [
    {
      organizationName :"CMC",
      organizationId :"1"
    },
    {
      organizationName :"CIST",
      organizationId :"2"
    },
  ]
  public countryResidencePlace: [any] = [
    {
      countryId: 237,
      countryName: "Việt Nam",
      countryCode: "VN",
      countryType: "Independent State",
    },
    
  ];
  private readonly currentUser = JSON.parse(
    localStorage.getItem("currentUser")
  );
  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private _personalEditService: PersonalEditService,
    private _personalListService: PersonalListService,
    
    ) { }

  ngOnInit(): void {
    this.formPersonalEdit = this.formBuilder.group({
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
    this.contentHeader = {
      headerTitle: 'Thuê Bao',
      actionButton: true,
      breadcrumb: {
        type: 'chevron',
        links: [
          {
            name: 'Quản lý thuê bao',
            isLink: true,
            link: '/apps/ip/subscribers-list'
          },
          {
            name: 'Chỉnh sửa thuê bao',
            isLink: true,
            link: '/apps/ip/subscribers-search'
          }
        ]
      }
    };
    
    this.getPersonalDetail();
    this.getOrganizationId();
    // this._personalEditService.getPersonalById()
  }

  getOrganizationId(){
    this._personalListService
      .getOrganizationId()
      .subscribe((res) => {
        this.organizationId = res.data
        console.log(res)
      }); 
  }

  getPersonalDetail(){
    this._unsubscribeAll = new Subject();
    this.lastValue = this.url.substr(this.url.lastIndexOf('/') + 1);
    this._personalEditService
      .getPersonalById(this.lastValue)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((personal:any) => {
        const data = personal.data
        this.formPersonalEdit.controls['username'].setValue(data.username);
        this.formPersonalEdit.controls['email'].setValue(data.email);
        this.formPersonalEdit.controls['organizationId'].setValue(data.organizationName);
        console.log(personal);
      });
  }

}
