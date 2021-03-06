import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { EntityProfileService } from '../entity-profile.service';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-profile-edit',
  templateUrl: './entity-profile-edit.component.html',
  styleUrls: ['./entity-profile-edit.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ProfileEditComponent implements OnInit, OnDestroy {
  // public
  public url = this.router.url;
  public lastValue;
  public data;
  public submitted = false;
  public buttonReturn: object;
  public endEntityProfileName: string;
  private _unsubscribeAll: Subject<any>;
  public contentHeader: object;
  public formEditProfile: FormGroup;
  public typeProfile = ['Cá nhân','Tổ chức','Thiết bị/dịch vụ'];
  // declare subject DNA
  public SubjectDnAttrs = [
    {
      name: 'CN',
      value: 'CN, Common name',
      
    },
    {
      name: 'C',
      value: 'C, Country (ISO 3166)',
      
    },
    {
      name: 'EMAILADDRESS',
      value: 'EmailAddress, E-mail address in DN',
      
    },
    {
      name: 'UID',
      value: 'UID, Unique Identifier',
      
    },
    {
      name: 'TELEPHONE_NUMBER',
      value: 'telephoneNumber',
      
    },

    {
      name: 'OU',
      value: 'OU, Organizational Unit',
      
    },
    {
      name: 'O',
      value: 'O, Organization',
      
    },
    {
      name: 'L',
      value: 'L, Locality',
      
    },
    {
      name: 'ST',
      value: 'ST, State or Province',
      
    },
    {
      name: 'STREET',
      value: 'streetAddress',
      
    },
    {
      name: 'SERIALNUMBER',
      value: 'SerialNumber, Serial number (in DN)',
      
    },
    {
      name: 'DN_QUALIFIER',
      value: 'dnQualifier, DN Qualifier',
      
    },
    {
      name: 'GIVENNAME',
      value: 'GivenName, Given name (first name)',
      
    },
    {
      name: 'INITIALS',
      value: 'Initials, First name abbreviation',
      
    },
    {
      name: 'SURNAME',
      value: 'Surname, Surname (last name)',
      
    },
    {
      name: 'T',
      value: 'Title, Title',
      
    },
    {
      name: 'POSTAL_ADDRESS',
      value: 'postalAddress',
      
    },
    {
      name: 'PSEUDONYM',
      value: 'pseudonym',
      
    },
    {
      name: 'DESCRIPTION',
      value: 'description, Description',
      
    },
    {
      name: 'UnstructuredAddress',
      value: 'unstructuredAddress, IP address',
      
    },
    {
      name: 'UnstructuredName',
      value: 'unstructuredName, Domain name (FQDN)',
      
    },
    {
      name: 'POSTAL_CODE',
      value: 'postalCode',
      
    },
    {
      name: 'DC',
      value: 'DC, Domain Component',
      
    },
    {
      name: 'BUSINESS_CATEGORY',
      value: 'businessCategory, Organization type',
      
    },
  ];

  // // declare subject ATT
  public SubjectAlterAttrs = [
    {
      name: 'rfc822Name',
      value: 'RFC 822 Name (e-mail address)',
      
    },
    {
      name: 'dNSName',
      value: 'DNS Name',
      
    },
    {
      name: 'iPAddress',
      value: 'IP Address',
      
    },
    {
      name: 'directoryName',
      value: 'Directory Name (Distinguished Name)',
      
    },
    {
      name: 'uniformResourceIdentifier',
      value: 'Uniform Resource Identifier (URI)',
      
    },
    {
      name: 'registeredID',
      value: 'Registered Identifier (OID)',
      
    },
    {
      name: 'ediPartyName',
      value: 'ediPartyName',
      
    },
    {
      name: 'x400Address',
      value: 'x400Address',
      
    },
    {
      name: 'otherName',
      value: 'otherName',
      
    },
    // {
    //   name: 'PI',
    //   value: 'Permanent Identifier',

    // },
    // {
    //   id: 'XA',
    //   value: 'XmppAddr',

    // },
    // {
    //   id: 'SN',
    //   value: 'Service Name',

    // },
    // {
    //   id: 'SIM',
    //   value: 'Subject Identification Method (SIM)',

    // },
  ];
  // declare subject ATT
  // public SubjectAlterAttrs = [
  //   {
  //     name: 'CN',
  //     value: 'CN, Common name',
      
  //   },
  //   {
  //     name: 'C',
  //     value: 'C, Country (ISO 3166)',
      
  //   },
  //   {
  //     name: 'EMAILADDRESS',
  //     value: 'EmailAddress, E-mail address in DN',
      
  //   },
  //   {
  //     name: 'UID',
  //     value: 'UID, Unique Identifier',
      
  //   },
  //   {
  //     name: 'TELEPHONE_NUMBER',
  //     value: 'telephoneNumber',
      
  //   },

  //   {
  //     name: 'OU',
  //     value: 'OU, Organizational Unit',
      
  //   },
  //   {
  //     name: 'O',
  //     value: 'O, Organization',
      
  //   },
  //   {
  //     name: 'L',
  //     value: 'L, Locality',
      
  //   },
  //   {
  //     name: 'ST',
  //     value: 'ST, State or Province',
      
  //   },
  //   {
  //     name: 'STREET',
  //     value: 'streetAddress',
      
  //   },
  //   {
  //     name: 'SERIALNUMBER',
  //     value: 'SerialNumber, Serial number (in DN)',
      
  //   },
  //   {
  //     name: 'DN_QUALIFIER',
  //     value: 'dnQualifier, DN Qualifier',
      
  //   },
  //   {
  //     name: 'GIVENNAME',
  //     value: 'GivenName, Given name (first name)',
      
  //   },
  //   {
  //     name: 'INITIALS',
  //     value: 'Initials, First name abbreviation',
      
  //   },
  //   {
  //     name: 'SURNAME',
  //     value: 'Surname, Surname (last name)',
      
  //   },
  //   {
  //     name: 'T',
  //     value: 'Title, Title',
      
  //   },
  //   {
  //     name: 'POSTAL_ADDRESS',
  //     value: 'postalAddress',
      
  //   },
  //   {
  //     name: 'PSEUDONYM',
  //     value: 'pseudonym',
      
  //   },
  //   {
  //     name: 'DESCRIPTION',
  //     value: 'description, Description',
      
  //   },
  //   {
  //     name: 'UnstructuredAddress',
  //     value: 'unstructuredAddress, IP address',
      
  //   },
  //   {
  //     name: 'UnstructuredName',
  //     value: 'unstructuredName, Domain name (FQDN)',
      
  //   },
  //   {
  //     name: 'POSTAL_CODE',
  //     value: 'postalCode',
      
  //   },
  //   {
  //     name: 'DC',
  //     value: 'DC, Domain Component',
      
  //   },
  //   {
  //     name: 'BUSINESS_CATEGORY',
  //     value: 'businessCategory, Organization type',
      
  //   },
  // ];

  public selectedDnA: any = this.SubjectDnAttrs[0];
  public selectedAlterA: any = this.SubjectAlterAttrs[0];

  //Checked subject
  constructor(
    private router: Router,
    private _entityProfileService: EntityProfileService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private _toastrService: ToastrService,
  ) {
    //  declare form group
    this.formEditProfile = this.fb.group({
      endEntityProfileName: [null, [Validators.required]],
      distinguishedName: this.fb.array([]),
      alternativeName: this.fb.array([]),
      typeProfile: [this.typeProfile[0], Validators.required],
    });

    this._unsubscribeAll = new Subject();
    this.lastValue = this.url.substr(this.url.lastIndexOf('/') + 1);
    console.log(this.lastValue);
    this._entityProfileService
      .getProfileId(this.lastValue)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((profile) => {
        console.log(profile);
        this.endEntityProfileName = profile.data.endEntityProfileName;
        this.formEditProfile
          .get('endEntityProfileName')
          .patchValue(profile.data.endEntityProfileName);
          profile.data.distinguishedName.forEach((dn) => {
          this.distinguishedName.push(
            this.createDistinguishedName(
              dn.name,
              false,
              dn.defaultValue,
              dn.required,
              dn.modifiable,
              dn.validation
            )
          );
        });
        profile.data.alternativeName.forEach((dn) => {
          this.alternativeName.push(
            this.createAlternativeName(
              dn.name,
              false,
              dn.defaultValue,
              dn.required,
              dn.modifiable,
              dn.validation
            )
          );
        });
      });
  }

  createDistinguishedName(
    name,
    isSelected: boolean,
    defaultValue: string,
    required: boolean,
    modifiable: boolean,
    validation: boolean
  ): FormGroup {
    return this.fb.group({
      name: [name, Validators.required],
      isSelected: [isSelected, Validators.requiredTrue],
      defaultValue: [defaultValue],
      required: [required, Validators.requiredTrue],
      modifiable: [modifiable, Validators.requiredTrue],
      validation: [validation, Validators.requiredTrue],
    });
  }

  createAlternativeName(
    name,
    isSelected: boolean,
    defaultValue: string,
    required: boolean,
    modifiable: boolean,
    validation: boolean
  ): FormGroup {
    return this.fb.group({
      name: [name, Validators.required],
      isSelected: [isSelected, Validators.requiredTrue],
      defaultValue: [defaultValue],
      required: [required, Validators.requiredTrue],
      modifiable: [modifiable, Validators.requiredTrue],
      validation: [validation, Validators.requiredTrue],
    });
  }

  get distinguishedName(): FormArray {
    return this.formEditProfile.get('distinguishedName') as FormArray;
  }
  get alternativeName(): FormArray {
    return this.formEditProfile.get('alternativeName') as FormArray;
  }

  ngOnInit(): void {
    this.contentHeader = {
      headerTitle: 'EntityProfile',
      actionButton: true,
      breadcrumb: {
        type: 'chevron',
        links: [
          {
            name: 'Danh sách',
            isLink: true,
            link: '/apps/ip/profiles/profile-list',
            // click: this.showListProfile = true
          },
          {
            name: 'Chỉnh sửa',
            isLink: false,
          },
        ],
      },
    };
    this.buttonReturn = {
      breadcrumbs: {
        links: [
          {
            name:'Quay lại',
            isLink: true,
            link: "/apps/ip/profiles/profile-list",
        }
        ]
      }
    };
  }
  get f() {
    return this.formEditProfile.controls;
  }

  //Xóa Profile
  removeProfile(entityId){
    console.log(entityId);
    this._entityProfileService
    .deleteProfileId(entityId)
    .toPromise()
    .then((res) =>{
        if(res.result == true ){
          this.router.navigate(['/apps/ip/profiles/profile-list']);
          this._toastrService.success(
            'Xóa Profile thành công ',
            'Thành công',
            { toastClass: 'toast ngx-toastr', closeButton: true }
          );
        }
    })
  }
  deleteProfile(){
    const routerParams = this.route.snapshot.paramMap;
    const id = routerParams.get('id');
    console.log(id);
    this.confirmRemoveProfile(id);
  }
  confirmRemoveProfile(entityId){
    Swal.fire({
      title: 'Bạn có chắc muốn xóa?',
      text: "Bạn sẽ không thể hoàn tác điều này!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#7367F0',
      preConfirm:   async () => {
      return this.removeProfile(entityId)
     },
      cancelButtonColor: '#E42728',
      cancelButtonText: "Thoát",
      confirmButtonText: 'Đúng, tôi muốn xóa!',
      customClass: {
        confirmButton: 'btn btn-primary',
        cancelButton: 'btn btn-danger ml-1'
      },
      allowOutsideClick:  () => {
        return !Swal.isLoading();
      }
    }).then(function (result:any) {
      console.log(result)
      if (result.value) {
        Swal.fire({
          icon: 'success',
          title: 'Thành công!',
          text: 'Bạn đã xóa thành công',
          customClass: {
            confirmButton: 'btn btn-success'
          }
        });
      }
    }
    
    );
  }
  // select subject DNA
  selectSubjectDNA(e) {}
  //  add subject DNA
  addSubjectDistinguishedName() {
    this.distinguishedName.push(
      this.fb.group({
        name: [this.selectedDnA.name, Validators.required],
        isSelected: [false, Validators.requiredTrue],
        defaultValue: [null, Validators.required],
        required: [false, Validators.requiredTrue],
        modifiable: [true, Validators.requiredTrue],
        validation: [false, Validators.requiredTrue],
      })
    );
  }

  removeDistinguishedName() {
    const index = this.distinguishedName.controls.length;
    for (let i = index - 1; i > -1; i--) {
      if (this.distinguishedName.controls[i].value.isSelected == true) {
        this.distinguishedName.controls[i].value.isSelected == false;
        this.distinguishedName.removeAt(i);
      }
    }
  }
  
  //  add subject attribute
  addSubjectAlternativeName() {
    this.alternativeName.push(
      this.fb.group({
        name: [this.selectedAlterA.name, Validators.required],
        isSelected: [false, Validators.requiredTrue],
        defaultValue: [null, Validators.required],
        required: [false, Validators.requiredTrue],
        modifiable: [true, Validators.requiredTrue],
        validation: [false, Validators.requiredTrue],
      })
    );
  }

  removeAlternativeName() {
    const index = this.alternativeName.controls.length;
    for (let i = index - 1; i > -1; i--) {
      if (this.alternativeName.controls[i].value.isSelected == true) {
        this.alternativeName.controls[i].value.isSelected == false;
        this.alternativeName.removeAt(i);
      }
    }
  }
  // submit
  confirmOpen() {
    Swal.fire({
      title: 'Bạn có chắc muốn cập nhật?',
      text: "Bạn sẽ không thể hoàn tác điều này!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#7367F0',
      preConfirm:   async () => {
      return await this._entityProfileService
      .updateProfileId(this.lastValue, JSON.stringify(this.formEditProfile.value))
      .pipe(takeUntil(this._unsubscribeAll))
      .toPromise().then(res=>{
        if(res.result==false){
          throw new Error(res.message);
        }
        return res;
      }).catch(
        function (error) {
          Swal.showValidationMessage('Mã lỗi:  ' + error + '');
        }
      );
     },
      cancelButtonColor: '#E42728',
      cancelButtonText: "Thoát",
      confirmButtonText: 'Đúng, tôi muốn cập nhật!',
      customClass: {
        confirmButton: 'btn btn-primary',
        cancelButton: 'btn btn-danger ml-1'
      },
      allowOutsideClick:  () => {
        return !Swal.isLoading();
      }
    }).then(function (result) {
      console.log(result)
      if (result.value) {
        Swal.fire({
          icon: 'success',
          title: 'Thành công!',
          text: 'EntityProfile đã được cập nhật.',
          customClass: {
            confirmButton: 'btn btn-success'
          }
        });
      }
    }
    
    );
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
