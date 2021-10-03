import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  encapsulation: ViewEncapsulation.None
})


export class SearchComponent implements OnInit {
  // Public
  public contentHeader: object;
  public searchType = [
    // {
    //   id: 1,
    //   key:"keypair",
    //   name: "Cặp khóa"
    // }, 
    {
      id: 2,
      key:"certRequest",
      name: "Yêu cầu chứng thực"
    }, 
    {
      id: 3,
      key:"cert",
      name: "Chứng thư số"
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
      headerTitle: 'Tìm kiếm',
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
            name: 'Tìm kiếm',
            isLink: false
          }
        ]
      }
    };

  }


}