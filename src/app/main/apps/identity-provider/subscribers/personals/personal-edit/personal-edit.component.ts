import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-personal-edit',
  templateUrl: './personal-edit.component.html',
  styleUrls: ['./personal-edit.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class PersonalEditComponent implements OnInit {

  formPersonalEdit: FormGroup;
  public contentHeader: object;
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
    private formBuilder: FormBuilder,
    ) { }

  ngOnInit(): void {
    this.formPersonalEdit = this.formBuilder.group({
      personalFirstName: [''],
      personalMiddleName: [''],
      personalLastName: [''],
      personalCountryId: [''],
      birthday: [''],
      gender: [''],
      email: [''],
      phoneNumber: [''],
      organizationId:[''],
      countryResidencePlace: [null, [Validators.required,]]
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
  }

}
