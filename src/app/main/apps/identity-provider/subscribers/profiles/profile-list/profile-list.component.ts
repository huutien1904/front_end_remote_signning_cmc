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
  
  editProfile(){
    console.log(this.titleProfile)
  }
  onChange(deviceValue) {
    this.titleProfile = deviceValue
    console.log(this.titleProfile);
  }
  
  openNewProfile() {
    this.showListProfile = false;
    this.showEditProfile = false;
    this.showAddProfile = true;
  }
  openEditProfile(){
    this.showListProfile = false;
    this.showEditProfile = true;
    this.showAddProfile = false;
  }
  listProfile:any 
  // = [
  //   {
  //     nameProfile:"CMC",
  //     subjectDNA:"A,B,c",
  //     subjectAttribute:"RFC,DFN,TPA"
  //   },
  //   {
      
  //     nameProfile:"CMC CIST",
  //     subjectDNA:"CN,UID,O,C,CN",
  //     subjectAttribute:"RFC,DFN,TPA"
  //   },
  // ]
  ngOnInit(): void {
    this.contentHeader = {
      headerTitle: 'Tạo UserProfiles',
      actionButton: true,
      breadcrumb: {
        type: 'chevron',
        links: [
          {
            name: 'Danh sách UserProfiles',
            isLink: true,
            link: '/apps/ip/subscribers/profiles/profile-list',
            
          },
          {
            name: 'Tạo UserProfiles',
            isLink: true,
            link: ''
          }
        ]
      }
    };
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
  addProfile(event){
    const idSubjectDNA = [];
    const idSubjectATT = [];
    console.log(event);
   
    event.subjectDNA.map((item) =>{
      idSubjectDNA.push(item.id);
      console.log(item.id);
    })
    event.subjectAttribute.map((item) =>{
      idSubjectATT.push(item.id);
    })
    event.subjectDNA = idSubjectDNA;
    event.subjectAttribute = idSubjectATT;
    // console.log(event)
    const newProfile = JSON.stringify(event);

    this._httpClient.post<any>(
      "http://localhost:3000/listProfiles",newProfile,this.option
     
    ).subscribe((res:any) => {
      console.log(res)
    });
    this.listProfile.push(event);
    this.showListProfile = true;
    this.showAddProfile = false;
    this.listProfile = [...this.listProfile]
    // console.log(this.listProfile);
  }
  
  openModalEdit(modal,rowIndex,row) {
    // this.item = item
    console.log(rowIndex,row);
    // this.rowIndex = rowIndex
    this.modalService.open(modal, {
    centered: true,
    size: "xl",
    });
  }
}
