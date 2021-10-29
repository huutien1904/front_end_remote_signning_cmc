import { Component, OnInit ,ViewEncapsulation,ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-create-subscribers',
  templateUrl: './create-subscribers.component.html',
  styleUrls: ['./create-subscribers.component.scss'],
  encapsulation: ViewEncapsulation.None
})


export class CreateSubscribersComponent implements OnInit {
  
  public selectPresonal = true;
  public selectOrganization = false;
  public contentHeader: object;
  formSelectSearch: FormGroup;
  constructor(private fb: FormBuilder,private el: ElementRef) { }
  public searchType = [
    {
      id: 1,
      key:"Thuê bao cá nhân",
      name: "Thuê bao cá nhân"
    }, 
    {
      id: 2,
      key:"Thuê bao tổ chức",
      name: "Thuê bao tổ chức"
    }, 
    {
      id: 3,
      key:"Danh sách thuê bao cá nhân",
      name: "Danh sách thuê bao cá nhân"
    }, 
    {
      id: 4,
      key:"Danh sách thuê bao tổ chức",
      name: "Danh sách thuê bao tổ chức"
    }, 
  ]  
  changeSelect(e){
    
      let myTag = this.el.nativeElement.querySelector("#form-peronal");
      console.log(myTag)
      // myTag.classList.remove('modal-dialog'); 
      // myTag.classList.add('create-subcriber');
      // let myTagOgn = this.el.nativeElement.querySelector("#modal-dialog-organization");
      // myTagOgn.classList.remove('modal-dialog'); 
      // myTagOgn.classList.add('create-orgnization');
  }
  ngOnInit(): void {
    this.contentHeader = {
      headerTitle: 'Tạo thuê bao',
      actionButton: true,
      breadcrumb: {
        type: 'chevron',
        links: [
          {
            name: 'Quản lý người dùng',
            isLink: false,
          },
          {
            name: 'Tạo thuê bao',
            isLink: true,
            link: '/apps/ip/subscribers-create'
          }
        ]
      }
    };
    this.formSelectSearch = this.fb.group({
      searchType : [this.searchType[0], Validators.required]
    })
    
    
  }


}
