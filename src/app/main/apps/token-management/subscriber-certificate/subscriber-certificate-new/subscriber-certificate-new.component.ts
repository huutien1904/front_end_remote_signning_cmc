import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-subscriber-certificate-new',
  templateUrl: './subscriber-certificate-new.component.html',
  styleUrls: ['./subscriber-certificate-new.component.scss']
})
export class SubscriberCertificateNewComponent implements OnInit {
  public contentHeader: object;
  public searchType = [
    {
      id: 1,
      key:"personals",
      name: "Thuê bao cá nhân"
    }, 
    {
      id: 2,
      key:"organizations",
      name: "Thuê bao tổ chức"
    },
  ]
  //Form
  formSelectSearch: FormGroup;
  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.formSelectSearch = this.fb.group({
      searchType : [null, Validators.required]
    })
    this.contentHeader = {
      headerTitle: 'Nhập chứng thư số',
      actionButton: true,
      breadcrumb: {
        type: 'chevron',
        links: [
          {
            name: 'Quản lý cặp khóa',
            isLink: true,
            link: '/apps/tm/search'
          },
          {
            name: 'Nhập chứng thư số',
            isLink: false
          }
        ]
      }
    };
  }

}
