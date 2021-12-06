import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { Component, EventEmitter, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-profile-sidebar',
  templateUrl: './profile-sidebar.component.html',
  styleUrls: ['./profile-sidebar.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ProfileSidebarComponent implements OnInit {

  @Output() submitProfile = new EventEmitter();

  public SubjectDNA = [
    {
      id: "EMAIL",
      value: "EmailAddress, E-mail address in DN",
      "required": false,
      "Modifiable": true,
      "Validation": false,

    },
    {
      id: "UID",
      value: "UID, Unique Identifier",
      "required": false,
      "Modifiable": true,
      "Validation": false,

    },
    {
      id: "CN",
      value: "CN, Common name",
      "required": false,
      "Modifiable": true,
      "Validation": false,

    },
    {
      id: "SDN",
      value: "SerialNumber, Serial number (in DN)",
      "required": false,
      "Modifiable": true,
      "Validation": false,
    },
    {
      id: "GIVENNAME",
      value: "GivenName, Given name (first name)",
      "required": false,
      "Modifiable": true,
      "Validation": false,
    },
    {
      id: "INITIALS",
      value: "Initials, First name abbreviation",
      "required": false,
      "Modifiable": true,
      "Validation": false,
    },
    {
      id: "SUBRNAME",
      value: "Surname, Surname (last name)",
      "required": false,
      "Modifiable": true,
      "Validation": false,
    },
    {
      id: "TITLE",
      value: "Title, Title",
      "required": false,
      "Modifiable": true,
      "Validation": false,
    },
    {
      id: "OU",
      value: "OU, Organizational Unit",
      "required": false,
      "Modifiable": true,
      "Validation": false,
    },
    {
      id: "O",
      value: "O, Organization",
      "required": false,
      "Modifiable": true,
      "Validation": false,
    },
    {
      id: "L",
      value: "L, Locality",
      "required": false,
      "Modifiable": true,
      "Validation": false,
    },
    {
      id: "ST",
      value: "ST, State or Province",
      "required": false,
      "Modifiable": true,
      "Validation": false,
    },
    {
      id: "DC",
      value: "DC, Domain Component",
      "required": false,
      "Modifiable": true,
      "Validation": false,
    },
    {
      id: "C",
      value: "C, Country (ISO 3166)",
      "required": false,
      "Modifiable": true,
      "Validation": false,
    },
    {
      id: "UST",
      value: "unstructuredAddress, IP address",
      "required": false,
      "Modifiable": true,
      "Validation": false,
    },
    {
      id: "UTN",
      value: "unstructuredName, Domain name (FQDN)",
      "required": false,
      "Modifiable": true,
      "Validation": false,
    },
    {
      id: "TN",
      value: "unstructuredAddress, IP address",
      "required": false,
      "Modifiable": true,
      "Validation": false,
    },
    {
      id: "PD",
      value: "pseudonym",
      "required": false,
      "Modifiable": true,
      "Validation": false,
    },
    {
      id: "SA",
      value: "streetAddress",
      "required": false,
      "Modifiable": true,
      "Validation": false,
    },
    {
      id: "dD",
      value: "description, Description",
      "required": false,
      "Modifiable": true,
      "Validation": false,
    },
    {
      id: "CIF",
      value: "CIF, Tax ID code, for companies (Spain)",
      "required": false,
      "Modifiable": true,
      "Validation": false,
    },
    {
      id: "NIF",
      value: "NIF, Tax ID number, for individuals (Spain)",
      "required": false,
      "Modifiable": true,
      "Validation": false,
    },
  ]
  public newProfile: FormGroup;
  public SubjectAttribute = [
    {
      id: "RFC",
      value: "RFC 822 Name (e-mail address)",
      "required": false,
      "Modifiable": true,
      "Validation": false,
    },
    {
      id: "DNS",
      value: "DNS Name",
      "required": false,
      "Modifiable": true,
      "Validation": false,
    },
    {
      id: "IPA",
      value: "IP Address",
      "required": false,
      "Modifiable": true,
      "Validation": false,
    },
    {
      id: "DN",
      value: "Directory Name (Distinguished Name)",
      "required": false,
      "Modifiable": true,
      "Validation": false,
    },
    {
      id: "URI",
      value: "Uniform Resource Identifier (URI)",
      "required": false,
      "Modifiable": true,
      "Validation": false,
    },
    {
      id: "OID",
      value: "Registered Identifier (OID)",
      "required": false,
      "Modifiable": true,
      "Validation": false,
    },
    {
      id: "MS UPN",
      value: "MS UPN, User Principal Name",
      "required": false,
      "Modifiable": true,
      "Validation": false,
    },
    {
      id: "MSG",
      value: "MS GUID, Globally Unique Identifier",
      "required": false,
      "Modifiable": true,
      "Validation": false,
    },
    {
      id: "KPN",
      value: "Kerberos KPN, Kerberos 5 Principal Name",
      "required": false,
      "Modifiable": true,
      "Validation": false,
    },
    {
      id: "PI",
      value: "Permanent Identifier",
      "required": false,
      "Modifiable": true,
      "Validation": false,
    },
    {
      id: "XA",
      value: "XmppAddr",
      "required": false,
      "Modifiable": true,
      "Validation": false,
    },
    {
      id: "SN",
      value: "Service Name",
      "required": false,
      "Modifiable": true,
      "Validation": false,
    },
    {
      id: "SIM",
      value: "Subject Identification Method (SIM)",
      "required": false,
      "Modifiable": true,
      "Validation": false,
    },

  ]
  public isChecked: boolean;
  public getSelectSubjectDNA = {};
  public listSubjectDNA = [];
  public selectedSubjectDNA: any = [];
  public getSelectSubjectAttribute = {};
  public listSubjectAttribute = [];
  public indexCheckedDNA = [];
  public indexCheckedATT = [];
  public showRemoveButtonDNA = false;
  public showRemoveButtonATT = false;
  selectSubjectDNA(e) {
    this.getSelectSubjectDNA = e;

  }
  addSubjectDNA() {
    this.showRemoveButtonDNA = true;

    console.log(this.getSelectSubjectDNA)
    this.listSubjectDNA.push(this.getSelectSubjectDNA);
    this.listSubjectDNA = [...this.listSubjectDNA];
    // this.listSubjectDNA
    console.log(this.listSubjectDNA);
    this.newProfile.controls['subjectDNA'].setValue(this.listSubjectDNA);
  }
  selectSubjectAttribute(e) {
    this.getSelectSubjectAttribute = e;
  }
  addSubjectAttribute() {
    this.showRemoveButtonATT = true;
    this.listSubjectAttribute.push(this.getSelectSubjectAttribute);
    this.listSubjectAttribute = [...this.listSubjectAttribute];
    console.log(this.listSubjectAttribute);
    this.newProfile.controls['subjectAttribute'].setValue(this.listSubjectAttribute);
  }
  getValueCheckBoxDNA( index) {
    this.indexCheckedDNA.push(index)
  }
  getValueCheckBoxATT(e, value, index) {
    this.indexCheckedATT.push(index)
  }

  removeSubjectDNA() {
    console.log(this.listSubjectDNA)
    console.log(this.listSubjectDNA[0])
    console.log(this.indexCheckedDNA)
    this.indexCheckedDNA.map((item) => {
      console.log(item)
      console.log(this.listSubjectDNA[item])
      this.listSubjectDNA = this.listSubjectDNA.filter((val, index) => {
        console.log(index)
        return item !== index;
      })
    })
    
    this.indexCheckedDNA = [];
    console.log(this.selectedSubjectDNA);

  }
  removeSubjectATT(){
    this.indexCheckedATT.map((item) => {
      console.log(item)
      // console.log(this.listSubjectDNA[item])
      this.listSubjectAttribute = this.listSubjectAttribute.filter((val, index) => {
        
        return index !== item;
      })
    })
    
    this.indexCheckedATT = [];
  }
  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
  ) {
    this.newProfile = this.fb.group({
      nameProfile: [null, [Validators.required,]],
      subjectDNA: [null, [Validators.required,]],
      subjectAttribute: [null, [Validators.required,]]
    })
  }

  ngOnInit(): void {
  }

  onSubmit() {
    this.submitProfile.emit(this.newProfile.value);
    console.log(this.newProfile.value)
  }
}
