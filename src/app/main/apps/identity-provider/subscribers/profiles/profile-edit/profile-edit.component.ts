
import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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
  public profileId:any
  public getSelectSubjectDNA ={};
  public getSelectSubjectAttribute={};
  public indexSelectedDNA = [];
  public indexSelectedATT = [];
  public editProfile: FormGroup;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
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
      value:"EmailAddress, E-mail address in DN",
      "required": false,
      "Modifiable": true,
      "Validation": false,
    },
    {
      id:"UID",
      value:"UID, Unique Identifier",
      "required": false,
      "Modifiable": true,
      "Validation": false
    },
    {
      id:"CN",
      value:"CN, Common name",
      "required": false,
      "Modifiable": true,
      "Validation": false
    },
    {
      id:"SDN",
      value:"SerialNumber, Serial number (in DN)",
      "required": false,
      "Modifiable": true,
      "Validation": false
    },
    {
      id:"GIVENNAME",
      value:"GivenName, Given name (first name)",
      "required": false,
      "Modifiable": true,
      "Validation": false
    },
    {
      id:"INITIALS",
      value:"Initials, First name abbreviation",
      "required": false,
      "Modifiable": true,
      "Validation": false
    },
    {
      id:"SUBRNAME",
      value:"Surname, Surname (last name)",
      "required": false,
      "Modifiable": true,
      "Validation": false
    },
    {
      id:"TITLE",
      value:"Title, Title",
      "required": false,
      "Modifiable": true,
      "Validation": false
    },
    {
      id:"OU",
      value:"OU, Organizational Unit",
      "required": false,
      "Modifiable": true,
      "Validation": false
    },
    {
      id:"O",
      value:"O, Organization",
      "required": false,
      "Modifiable": true,
      "Validation": false
    },
    {
      id:"L",
      value:"L, Locality",
      "required": false,
      "Modifiable": true,
      "Validation": false
    },
    {
      id:"ST",
      value:"ST, State or Province",
      "required": false,
      "Modifiable": true,
      "Validation": false
    },
  ]
  public SubjectAttribute = [
    {
      id:"RFC",
      value:"RFC 822 Name (e-mail address)",
      "required": false,
      "Modifiable": true,
      "Validation": false
    },
    {
      id:"DNS",
      value:"DNS Name",
      "required": false,
      "Modifiable": true,
      "Validation": false
    },
    {
      id:"IPA",
      value:"IP Address",
      "required": false,
      "Modifiable": true,
      "Validation": false
    },
    {
      id:"DN",
      value:"Directory Name (Distinguished Name)",
      "required": false,
      "Modifiable": true,
      "Validation": false
    },
    {
      id:"URI",
      value:"Uniform Resource Identifier (URI)",
      "required": false,
      "Modifiable": true,
      "Validation": false
    },
    {
      id:"OID",
      value:"Registered Identifier (OID)",
      "required": false,
      "Modifiable": true,
      "Validation": false
    },
    {
      id:"MS UPN",
      value:"MS UPN, User Principal Name",
      "required": false,
      "Modifiable": true,
      "Validation": false
    },
    {
      id:"MSG",
      value:"MS GUID, Globally Unique Identifier",
      "required": false,
      "Modifiable": true,
      "Validation": false
    },
    {
      id:"KPN",
      value:"Kerberos KPN, Kerberos 5 Principal Name",
      "required": false,
      "Modifiable": true,
      "Validation": false
    },
    {
      id:"PI",
      value:"Permanent Identifier",
      "required": false,
      "Modifiable": true,
      "Validation": false
    },
    {
      id:"XA",
      value:"XmppAddr",
      "required": false,
      "Modifiable": true,
      "Validation": false
    },
    {
      id:"SN",
      value:"Service Name",
      "required": false,
      "Modifiable": true,
      "Validation": false
    },
    {
      id:"SIM",
      value:"Subject Identification Method (SIM)",
      "required": false,
      "Modifiable": true,
      "Validation": false
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
      console.log(this.subjectDNARecent);
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
  getValueCheckBoxDNA(e,value,i){
    this.indexSelectedDNA.push(i);
  }
  removeSubjectDNA(){
    
    this.indexSelectedDNA.map((item) => {
      
      this.subjectDNARecent = this.subjectDNARecent.filter((val, index) => {
        console.log(index)
        return item !== index;
      })
    })
    this.editProfile.controls['subjectDNA'].setValue(this.subjectDNARecent);
    
  }
  getValueCheckBoxATT(index){
    this.indexSelectedATT.push(index);
    console.log(this.indexSelectedATT);
  }
  removeSubjectATT(){
    
    this.indexSelectedATT.map((item) => {
      
      this.subjectAttributeRecent = this.subjectAttributeRecent.filter((val, index) => {
        console.log(index)
        return item !== index;
      })
    })
    this.editProfile.controls['subjectAttribute'].setValue(this.subjectAttributeRecent);
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
    console.log(newProfile);
    this._httpClient.put<any>(
      `http://localhost:3000/listProfiles/${this.profileId}`,newProfile,this.option
    ).subscribe((res:any) => {
      console.log(res)
      this.router.navigateByUrl('/apps/ip/subscribers/profiles/profile-list').then(e => {
        if (e) {
          console.log("Navigation is successful!");
        } else {
          console.log("Navigation has failed!");
        }
      });
    });
    // console.log(this.editProfile.value)
  }
  
}
