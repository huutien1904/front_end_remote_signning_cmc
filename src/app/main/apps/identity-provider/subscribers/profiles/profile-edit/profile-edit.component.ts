
import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ProfileEditComponent implements OnInit {
  public profileRecent:any = {};
  public subjectDNARecent:any = [];
  public subjectAttributeRecent:any = [];
  public showRemoveButtonDNA = true;
  public showRemoveButtonATT = true;
  public selectedSubjectDNA:any = [];
  public getSelectSubjectDNA ={};
  public profileId:any
  public getSelectSubjectAttribute={};

  public editProfile: FormGroup;
  constructor(
    private route: ActivatedRoute,
    private _httpClient: HttpClient,
    private fb: FormBuilder,
  ) {
    this.editProfile = this.fb.group({
      nameProfile: [null, [Validators.required,]],
      subjectDNA :[null, [Validators.required,]],
      subjectAttribute:[null, [Validators.required,]]
    })
   }
  public ListSubjectDNA:any = [];
  public SubjectDNA = [
    {
      id:"EMAIL",
      value:"EmailAddress, E-mail address in DN"
    },
    {
      id:"UID",
      value:"UID, Unique Identifier"
    },
    {
      id:"CN",
      value:"CN, Common name"
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
  ]
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
  private option = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  ngOnInit(): void {
    const routerParams = this.route.snapshot.paramMap
    this.profileId = routerParams.get('id');
    this._httpClient.get(`http://localhost:3000/listProfiles/${this.profileId}`).subscribe((res:any) => {
      console.log('data response', res);
       this.profileRecent = res;
      console.log(this.profileRecent);
      // this.subjectDNARecent = this.profileRecent.subjectDNA
      this.profileRecent.subjectDNA.map((item) => {
        this.SubjectDNA.map((subitem) =>{
            if(item === subitem.id){
              this.subjectDNARecent.push(subitem);
            }
          })
      })
      this.profileRecent.subjectAttribute.map((item) => {
        this.SubjectAttribute.map((subitem) =>{
            if(item === subitem.id){
              this.subjectAttributeRecent.push(subitem);
            }
          })
      })
    this.editProfile.controls['nameProfile'].setValue(this.profileRecent.nameProfile);
    this.editProfile.controls['subjectDNA'].setValue(this.subjectDNARecent);
    this.editProfile.controls['subjectAttribute'].setValue(this.subjectAttributeRecent);
    });
    
    
  }
  selectSubjectDNA(e){
    console.log(e)
    this.getSelectSubjectDNA = e;
  }
  addSubjectDNA(){
    console.log(this.getSelectSubjectDNA);
    this.subjectDNARecent.push(this.getSelectSubjectDNA);
    this.subjectDNARecent = [...this.subjectDNARecent];
    // this.listSubjectDNA
    console.log(this.subjectDNARecent);
    this.editProfile.controls['subjectDNA'].setValue(this.subjectDNARecent);
  }
  getValueCheckBox(e,value){
    
    if(e.target.checked){
      this.selectedSubjectDNA.push(value);
      this.selectedSubjectDNA = [...this.selectedSubjectDNA];
      console.log(this.selectedSubjectDNA);
    }
    
  }
  removeSubjectDNA(){
    this.selectedSubjectDNA.map((item) =>{
      this.subjectDNARecent = this.subjectDNARecent.filter((val) =>{
        return val.id !== item.id;
      })
    })
    this.selectedSubjectDNA = [];
    console.log(this.selectedSubjectDNA);
  }
  selectSubjectAttribute(e){
    this.getSelectSubjectAttribute = e;
  }
  addSubjectAttribute(){
    this.subjectAttributeRecent.push(this.getSelectSubjectAttribute);
    this.subjectAttributeRecent = [...this.subjectAttributeRecent];
    console.log(this.subjectAttributeRecent);
    this.editProfile.controls['subjectAttribute'].setValue(this.subjectAttributeRecent);
  }
  setValueName(e){
    this.editProfile.controls['nameProfile'].setValue(e.target.value);
    console.log(e.target.value)
  }
  onSubmit(){
    const idSubjectDNA = [];
    const idSubjectATT = [];
    console.log(this.editProfile.value);
   
    this.editProfile.value.subjectDNA.map((item) =>{
      idSubjectDNA.push(item.id);
      console.log(item.id);
    })
    this.editProfile.value.subjectAttribute.map((item) =>{
      idSubjectATT.push(item.id);
    })
    this.editProfile.value.subjectDNA = idSubjectDNA;
    this.editProfile.value.subjectAttribute = idSubjectATT;
    const newProfile = JSON.stringify(this.editProfile.value);
    this._httpClient.put<any>(
      `http://localhost:3000/listProfiles/${this.profileId}`,newProfile,this.option
    ).subscribe((res:any) => {
      console.log(res)
    });
    // console.log(this.editProfile.value)
  }
  
}
