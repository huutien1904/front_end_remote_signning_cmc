import { Component, OnDestroy, OnInit, ViewEncapsulation } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { ProfileService } from "../profile.service";
@Component({
  selector: "app-profile-edit",
  templateUrl: "./profile-edit.component.html",
  styleUrls: ["./profile-edit.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class ProfileEditComponent implements OnInit, OnDestroy {
  // public
  public url = this.router.url;
  public lastValue;
  public data;

  public nameProfile: string;
  private _unsubscribeAll: Subject<any>;
  public contentHeader: object;
  public profileRecent: any = {};
  public subjectDNARecent: any = [];
  public showRemoveButtonDNA = true;
  public showRemoveButtonATT = true;
  public selectedSubjectDNA: any = [];
  public profileId: any;
  public getSelectSubjectDNA = {};
  public getSelectSubjectAttribute = {};
  public indexSelectedDNA = [];
  public indexSelectedATT = [];
  public formEditProfile: FormGroup;
  public formDistinguishedName: FormGroup;
  public formAlternativeName: FormGroup;
  public checkTest=true;
  constructor(
    private router: Router,
    private _profileService: ProfileService,
    private fb: FormBuilder
  ) {
    //  declare form group
    this.formEditProfile = this.fb.group({
      nameProfile: [null, [Validators.required]],
      distinguishedName: this.fb.array([]),
      alternativeName: this.fb.array([]),
    });
    this.formDistinguishedName = this.fb.group({
      name: [null, Validators.required],
      required: [false, Validators.required],
      modifiable: [true, Validators.required],
      validation: [false, Validators.required],
    });
    this.formAlternativeName = this.fb.group({
      name: [null, Validators.required],
      required: [false, Validators.required],
      modifiable: [true, Validators.required],
      validation: [false, Validators.required],
    });

    this._unsubscribeAll = new Subject();
    this.lastValue = this.url.substr(this.url.lastIndexOf("/") + 1);
    console.log(this.lastValue);
    this._profileService
      .getProfileId(this.lastValue)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((profile) => {
        console.log(profile);
        this.nameProfile = profile.data.endEntityProfileName;
        this.formEditProfile
          .get("nameProfile")
          .patchValue(profile.data.endEntityProfileName);
        profile.data.distinguishedName.forEach((dn) => {
          this.distinguishedName.push(
            this.createDistinguishedName(
              dn.name,
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
              dn.required,
              dn.modifiable,
              dn.validation
            )
          );
          console.log(this.formEditProfile.get("alternativeName").value);
        });
        console.log(typeof(this.formEditProfile.get("distinguishedName").value[1].required));
        console.log(this.formEditProfile.get("distinguishedName").value[1].required==true);
      });
  }

  createDistinguishedName(name, required:boolean, modifiable:boolean, validation:boolean): FormGroup {
    console.log(modifiable);
    
    return this.fb.group({
      name: [name, Validators.required],
      required: [required, Validators.requiredTrue],
      modifiable: [modifiable, Validators.requiredTrue],
      validation: [validation, Validators.requiredTrue],
    });
  }

  createAlternativeName(name, required, modifiable, validation): FormGroup {
    return this.fb.group({
      name: [name, Validators.required],
      required: [required, Validators.requiredTrue],
      modifiable: [modifiable, Validators.requiredTrue],
      validation: [validation, Validators.requiredTrue],
    });
  }

  get distinguishedName(): FormArray {
    return this.formEditProfile.get("distinguishedName") as FormArray;
  }
  get alternativeName(): FormArray {
    return this.formEditProfile.get("alternativeName") as FormArray;
  }

  public ListSubjectDNA: any = [];

  // declare subject DNA
  public SubjectDNA = [
    {
      id: "EMAIL",
      value: "EmailAddress, E-mail address in DN",
      required: false,
      Modifiable: true,
      Validation: false,
    },
    {
      id: "UID",
      value: "UID, Unique Identifier",
      required: false,
      Modifiable: true,
      Validation: false,
    },
    {
      id: "CN",
      value: "CN, Common name",
      required: false,
      Modifiable: true,
      Validation: false,
    },
    {
      id: "SDN",
      value: "SerialNumber, Serial number (in DN)",
      required: false,
      Modifiable: true,
      Validation: false,
    },
    {
      id: "GIVENNAME",
      value: "GivenName, Given name (first name)",
      required: false,
      Modifiable: true,
      Validation: false,
    },
    {
      id: "INITIALS",
      value: "Initials, First name abbreviation",
      required: false,
      Modifiable: true,
      Validation: false,
    },
    {
      id: "SUBRNAME",
      value: "Surname, Surname (last name)",
      required: false,
      Modifiable: true,
      Validation: false,
    },
    {
      id: "TITLE",
      value: "Title, Title",
      required: false,
      Modifiable: true,
      Validation: false,
    },
    {
      id: "OU",
      value: "OU, Organizational Unit",
      required: false,
      Modifiable: true,
      Validation: false,
    },
    {
      id: "O",
      value: "O, Organization",
      required: false,
      Modifiable: true,
      Validation: false,
    },
    {
      id: "L",
      value: "L, Locality",
      required: false,
      Modifiable: true,
      Validation: false,
    },
    {
      id: "ST",
      value: "ST, State or Province",
      required: false,
      Modifiable: true,
      Validation: false,
    },
  ];

  // declare subject ATT
  public SubjectAttribute = [
    {
      id: "RFC",
      value: "RFC 822 Name (e-mail address)",
      required: false,
      Modifiable: true,
      Validation: false,
    },
    {
      id: "DNS",
      value: "DNS Name",
      required: false,
      Modifiable: true,
      Validation: false,
    },
    {
      id: "IPA",
      value: "IP Address",
      required: false,
      Modifiable: true,
      Validation: false,
    },
    {
      id: "DN",
      value: "Directory Name (Distinguished Name)",
      required: false,
      Modifiable: true,
      Validation: false,
    },
    {
      id: "URI",
      value: "Uniform Resource Identifier (URI)",
      required: false,
      Modifiable: true,
      Validation: false,
    },
    {
      id: "OID",
      value: "Registered Identifier (OID)",
      required: false,
      Modifiable: true,
      Validation: false,
    },
    {
      id: "MS UPN",
      value: "MS UPN, User Principal Name",
      required: false,
      Modifiable: true,
      Validation: false,
    },
    {
      id: "MSG",
      value: "MS GUID, Globally Unique Identifier",
      required: false,
      Modifiable: true,
      Validation: false,
    },
    {
      id: "KPN",
      value: "Kerberos KPN, Kerberos 5 Principal Name",
      required: false,
      Modifiable: true,
      Validation: false,
    },
    {
      id: "PI",
      value: "Permanent Identifier",
      required: false,
      Modifiable: true,
      Validation: false,
    },
    {
      id: "XA",
      value: "XmppAddr",
      required: false,
      Modifiable: true,
      Validation: false,
    },
    {
      id: "SN",
      value: "Service Name",
      required: false,
      Modifiable: true,
      Validation: false,
    },
    {
      id: "SIM",
      value: "Subject Identification Method (SIM)",
      required: false,
      Modifiable: true,
      Validation: false,
    },
  ];

  ngOnInit(): void {
    this.contentHeader = {
      headerTitle: "EntityProfile",
      // actionButton: true,
      breadcrumb: {
        type: "chevron",
        links: [
          {
            name: "Danh sách",
            isLink: true,
            link: "/apps/ip/profiles/profile-list",
            // click: this.showListProfile = true
          },
          {
            name: "Chỉnh sửa",
            isLink: false,
          },
        ],
      },
    };
  }
  get f() {
    return this.formEditProfile.controls;
  }

  // select subject DNA
  selectSubjectDNA(e) {}
  //  add subject DNA
  addSubjectDNA() {}
  // get index checkbox DNA to delete
  getValueCheckBoxDNA(e, value, i) {}
  // remove suject DNA
  removeSubjectDNA() {}

  // get select subject att
  selectSubjectAttribute(e) {
    this.getSelectSubjectAttribute = e;
  }
  //  add subject attribute
  addSubjectAttribute() {}
  // get index checkbox ATT
  getValueCheckBoxATT(index) {}

  // remove subject ATT
  removeSubjectATT() {}
  // set name when change name
  setValueName(e) {}
  // submit
  onSubmit() {}
  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
