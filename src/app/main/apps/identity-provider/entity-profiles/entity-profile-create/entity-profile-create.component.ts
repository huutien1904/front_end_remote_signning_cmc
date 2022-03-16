import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { EntityProfileService } from '../entity-profile.service';

@Component({
  selector: 'app-entity-profile-create',
  templateUrl: './entity-profile-create.component.html',
  styleUrls: ['./entity-profile-create.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class EntityProfileCreateComponent implements OnInit {
  // public
  public submitted = false;
  public contentHeader: object;
  public formCreateProfile: FormGroup;
  private _unsubscribeAll: Subject<any>;
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
    {
      name: 'PI',
      value: 'Permanent Identifier',
    },
    {
      id: 'XA',
      value: 'XmppAddr',
    },
    {
      id: 'SN',
      value: 'Service Name',
    },
    {
      id: 'SIM',
      value: 'Subject Identification Method (SIM)',
    },
  ];
  public typeProfile = ['Cá nhân', 'Tổ chức', 'Thiết bị/dịch vụ'];
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

  constructor(
    private _entityProfileService: EntityProfileService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.formCreateProfile = this.fb.group({
      endEntityProfileName: [null, [Validators.required]],
      distinguishedName: this.fb.array([], Validators.required),
      alternativeName: this.fb.array([]),
      typeProfile: [null, Validators.required],
    });
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
            name: 'Thêm mới',
            isLink: false,
          },
        ],
      },
    };
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
    return this.formCreateProfile.get('distinguishedName') as FormArray;
  }
  get alternativeName(): FormArray {
    return this.formCreateProfile.get('alternativeName') as FormArray;
  }
  get f() {
    return this.formCreateProfile.controls;
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
    console.log(this.formCreateProfile.value);
    if (
      this.formCreateProfile.value.endEntityProfileName == null ||
      this.formCreateProfile.value.alternativeName.length === 0 ||
      this.formCreateProfile.value.distinguishedName.length === 0
    ) {
      Swal.fire({
        title: 'Bạn phải điền đầy đủ các trường?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#7367F0',
        cancelButtonText: 'Thoát',
        confirmButtonText: 'OK',
        customClass: {
          confirmButton: 'btn btn-primary',
          cancelButton: 'btn btn-danger ml-1',
        },
      });
    }
    if (
      this.formCreateProfile.value.endEntityProfileName !== null &&
      this.formCreateProfile.value.alternativeName.length > 0 &&
      this.formCreateProfile.value.distinguishedName.length > 0
    ) {
      Swal.fire({
        title: 'Bạn có chắc muốn tạo profile?',
        text: 'Bạn sẽ không thể hoàn tác điều này!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#7367F0',
        preConfirm: async () => {
          return await this._entityProfileService
            .createProfile(JSON.stringify(this.formCreateProfile.value))
            // .pipe(takeUntil(this._unsubscribeAll))
            .toPromise()
            .then((res) => {
              if (res.result == false) {
                throw new Error(res.message);
              }
              this.router.navigate(['/apps/ip/profiles/profile-list']);
              return res;
            })
            .catch(function (error) {
              Swal.showValidationMessage('Mã lỗi:  ' + error + '');
            });
        },
        cancelButtonColor: '#E42728',
        cancelButtonText: 'Thoát',
        confirmButtonText: 'Đúng, tôi muốn thêm mới!',
        customClass: {
          confirmButton: 'btn btn-primary',
          cancelButton: 'btn btn-danger ml-1',
        },
        allowOutsideClick: () => {
          return !Swal.isLoading();
        },
      }).then(function (result) {
        console.log(result)
        if (result.isDismissed) {
          Swal.fire({
            icon: 'success',
            title: 'Thành công!',
            text: 'EntityProfile đã được thêm mới.',
            customClass: {
              confirmButton: 'btn btn-success',
            },
          });
        }
      });
    }

    // else{
    //   Swal.fire({
    //     title: 'Bạn có chắc muốn tạo profile?',
    //     text: "Bạn sẽ không thể hoàn tác điều này!",
    //     icon: 'warning',
    //     showCancelButton: true,
    //     confirmButtonColor: '#7367F0',
    //     preConfirm:   async () => {
    //     return await this._entityProfileService
    //     .createProfile( JSON.stringify(this.formCreateProfile.value))
    //     // .pipe(takeUntil(this._unsubscribeAll))
    //     .toPromise().then(res=>{
    //       if(res.result==false){
    //         throw new Error(res.message);
    //       }
    //       this.router.navigate(['/apps/ip/profiles/profile-list']);
    //       return res;
    //     }).catch(
    //       function (error) {
    //         Swal.showValidationMessage('Mã lỗi:  ' + error + '');
    //       }
    //     );
    //    },
    //     cancelButtonColor: '#E42728',
    //     cancelButtonText: "Thoát",
    //     confirmButtonText: 'Đúng, tôi muốn thêm mới!',
    //     customClass: {
    //       confirmButton: 'btn btn-primary',
    //       cancelButton: 'btn btn-danger ml-1'
    //     },
    //     allowOutsideClick:  () => {
    //       return !Swal.isLoading();
    //     }
    //   }).then(function (result) {
    //     if (result.value) {
    //       Swal.fire({
    //         icon: 'success',
    //         title: 'Thành công!',
    //         text: 'EntityProfile đã được thêm mới.',
    //         customClass: {
    //           confirmButton: 'btn btn-success'
    //         }
    //       });
    //     }
    //   }

    //   );
    // }

    // this._entityProfileService
    //   .createProfile( JSON.stringify(this.formCreateProfile.value))
    //   .subscribe((res) =>{
    //     console.log(res);
    //     this.router.navigate(['/apps/ip/profiles/profile-list']);

    //   })
  }
}
