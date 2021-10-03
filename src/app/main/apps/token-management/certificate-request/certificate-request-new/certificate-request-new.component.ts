import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-certificate-request-new',
  templateUrl: './certificate-request-new.component.html',
  styleUrls: ['./certificate-request-new.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CertificateRequestNewComponent implements OnInit {
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
      searchType : [this.searchType[0], Validators.required]
    })
    this.contentHeader = {
      headerTitle: 'Tạo yêu cầu chứng thực',
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
            name: 'Tạo yêu cầu chứng thực',
            isLink: false
          }
        ]
      }
    };
  }

}
