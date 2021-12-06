import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ColumnMode, SelectionType } from '@swimlane/ngx-datatable';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-profile-list',
  templateUrl: './profile-list.component.html',
  styleUrls: ['./profile-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ProfileListComponent implements OnInit {
  public titleProfile:any;
  public ColumnMode = ColumnMode;
  public SelectionType = SelectionType;
  public rowIndex:any
  public showListProfile = true;
  public showAddProfile = false;
  public showEditProfile = false;
  public contentHeader: object;
  constructor(
    private modalService: NgbModal,
    private _httpClient: HttpClient,
  ) { }
  
  //  open form new profile close table list profile
  openNewProfile(){
    this.showListProfile = false;
    this.showEditProfile = false;
    this.showAddProfile = true;
  }

  
  listProfile:any 
  
  ngOnInit(): void {

    // content header profile
    this.contentHeader = {
      headerTitle: 'Tạo UserProfiles',
      actionButton: true,
      breadcrumb: {
        type: 'chevron',
        links: [
          {
            name: 'Danh sách UserProfiles',
            isLink: true,
            // link: '/apps/ip/subscribers/profiles/profile-list',
            click: this.showListProfile = true
          },
          {
            name: 'Tạo UserProfiles',
            isLink: true,
            link: ''
          }
        ]
      }
    };
    // end content header profile


    // get data from api
    this._httpClient.get('http://localhost:3000/listProfiles').subscribe((res) => {
      console.log("check get data")
      console.log('data response', res);
      this.listProfile = res
    });

  }
  
  private option = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  // post profile to API
  addProfile(event){
    const idSubjectDNA = [];
    const idSubjectATT = [];
    console.log(event);
    //  get id subjectDNA
    event.subjectDNA.map((item) =>{
      idSubjectDNA.push(item.id);
      console.log(item.id);
    })
    //  get id subjectATT
    event.subjectAttribute.map((item) =>{
      idSubjectATT.push(item.id);
    })
    // add id to data 
    event.subjectDNA = idSubjectDNA;
    event.subjectAttribute = idSubjectATT;
    // console.log(event)
    const newProfile = JSON.stringify(event);
    //  post api
    this._httpClient.post<any>(
      "http://localhost:3000/listProfiles",newProfile,this.option
     
    ).subscribe((res:any) => {
      console.log(res)
    });
    // this.listProfile.push(event);
    this.showListProfile = true;
    this.showAddProfile = false;
    this.listProfile = [...this.listProfile]
    // console.log(this.listProfile);
  }
  
  
}
