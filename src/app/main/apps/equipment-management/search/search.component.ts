import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SearchComponent implements OnInit {
  public contentHeader: object;
  public formSelectSearch: FormGroup;
  public searchType = [
    {
      id: 1,
      key: 'hsm',
      name: 'HSM'
    },
    {
      id: 2,
      key: 'token',
      name: 'Token'
    }
  ]


  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.formSelectSearch = this.fb.group({
      searchType : [null, Validators.required]
    })
    this.contentHeader = {
      headerTitle: 'Tìm kiếm',
      actionButton: true,
      breadcrumb: {
        type: 'chevron',
        links: [
          {
            name: 'Quản lý thiết bị',
            isLink: true,
            link: '/apps/equipment-management/search'
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
