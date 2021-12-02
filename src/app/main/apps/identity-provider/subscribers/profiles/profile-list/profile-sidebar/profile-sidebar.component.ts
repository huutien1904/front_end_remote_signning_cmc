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
      id:"EMAIL",
      value:"EmailAddress, E-mail address in DN",
      
    },
    {
      id:"UID",
      value:"UID, Unique Identifier",
      
    },
    {
      id:"CN",
      value:"CN, Common name",
      
    },
    {
      id:"SDN",
      value:"SerialNumber, Serial number (in DN)"
    },
    {
      id:"GIVENNAME",
      value:"GivenName, Given name (first name)"
    },
    {
      id:"INITIALS",
      value:"Initials, First name abbreviation"
    },
    {
      id:"SUBRNAME",
      value:"Surname, Surname (last name)"
    },
    {
      id:"TITLE",
      value:"Title, Title"
    },
    {
      id:"OU",
      value:"OU, Organizational Unit"
    },
    {
      id:"O",
      value:"O, Organization"
    },
    {
      id:"L",
      value:"L, Locality"
    },
    {
      id:"ST",
      value:"ST, State or Province"
    },
    {
      id:"DC",
      value:"DC, Domain Component"
    },
    {
      id:"C",
      value:"C, Country (ISO 3166)"
    },
    {
      id:"UST",
      value:"unstructuredAddress, IP address"
    },
    {
      id:"UTN",
      value:"unstructuredName, Domain name (FQDN)"
    },
    {
      id:"TN",
      value:"unstructuredAddress, IP address"
    },
    {
      id:"PD",
      value:"pseudonym"
    },
    {
      id:"SA",
      value:"streetAddress"
    },
    {
      id:"dD",
      value:"description, Description"
    },
    {
      id:"CIF",
      value:"CIF, Tax ID code, for companies (Spain)"
    },
    {
      id:"NIF",
      value:"NIF, Tax ID number, for individuals (Spain)"
    },
  ]
  public newProfile: FormGroup;
  public SubjectAttribute = [
    {
      id:"RFC",
      value:"RFC 822 Name (e-mail address)"
    },
    {
      id:"DNS",
      value:"DNS Name"
    },
    {
      id:"IPA",
      value:"IP Address"
    },
    {
      id:"DN",
      value:"Directory Name (Distinguished Name)"
    },
    {
      id:"URI",
      value:"Uniform Resource Identifier (URI)"
    },
    {
      id:"OID",
      value:"Registered Identifier (OID)"
    },
    {
      id:"MS UPN",
      value:"MS UPN, User Principal Name"
    },
    {
      id:"MSG",
      value:"MS GUID, Globally Unique Identifier"
    },
    {
      id:"KPN",
      value:"Kerberos KPN, Kerberos 5 Principal Name"
    },
    {
      id:"PI",
      value:"Permanent Identifier"
    },
    {
      id:"XA",
      value:"XmppAddr"
    },
    {
      id:"SN",
      value:"Service Name"
    },
    {
      id:"SIM",
      value:"Subject Identification Method (SIM)"
    },

  ]
  public  isChecked : boolean;
  public getSelectSubjectDNA ={};
  public listSubjectDNA = [];
  public selectedSubjectDNA:any = [];
  public getSelectSubjectAttribute={};
  public listSubjectAttribute = [];
  public showRemoveButtonDNA = false;
  public showRemoveButtonATT = false;
  selectSubjectDNA(e){
    this.getSelectSubjectDNA = e;
  }
  addSubjectDNA(){
    this.showRemoveButtonDNA = true;
    this.listSubjectDNA.push(this.getSelectSubjectDNA);
    this.listSubjectDNA = [...this.listSubjectDNA];
    // this.listSubjectDNA
    console.log(this.listSubjectDNA);
    this.newProfile.controls['subjectDNA'].setValue(this.listSubjectDNA);
  }
  selectSubjectAttribute(e){
    this.getSelectSubjectAttribute = e;
  }
  addSubjectAttribute(){
    this.showRemoveButtonATT = true;
    this.listSubjectAttribute.push(this.getSelectSubjectAttribute);
    this.listSubjectAttribute = [...this.listSubjectAttribute];
    console.log(this.listSubjectAttribute);
    this.newProfile.controls['subjectAttribute'].setValue(this.listSubjectAttribute);
  }
  getValueCheckBox(e,value){
    
    console.log(this.listSubjectDNA)
    
    if(e.target.checked){
      this.selectedSubjectDNA.push(value);
      this.selectedSubjectDNA = [...this.selectedSubjectDNA];
      console.log(this.selectedSubjectDNA);
    }
    
  }
  
  removeSubjectDNA(){
    this.selectedSubjectDNA.map((item) =>{
      this.listSubjectDNA = this.listSubjectDNA.filter((val) =>{
        return val.id !== item.id;
      })
    })
    this.selectedSubjectDNA = [];
    console.log(this.selectedSubjectDNA);
  }
  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
  ) {
    this.newProfile = this.fb.group({
      nameProfile: [null, [Validators.required,]],
      subjectDNA :[null, [Validators.required,]],
      subjectAttribute:[null, [Validators.required,]]
    })
   }

  ngOnInit(): void {
  }
  
  onSubmit(){
    this.submitProfile.emit(this.newProfile.value);
    console.log(this.newProfile.value)
  }
}
