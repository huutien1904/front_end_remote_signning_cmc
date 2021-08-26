import { Component, OnInit ,ViewEncapsulation} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-search-subcribers',
  templateUrl: './search-subcribers.component.html',
  styleUrls: ['./search-subcribers.component.scss'],
  encapsulation: ViewEncapsulation.None
})


export class SearchSubcribersComponent implements OnInit {
  // imports: [FeatherIconDirective]
  // declarations: [ FeatherIconDirective]
  public subcriberP = true
  public subcriberO = false
  public contentHeader: object;
  formSelectSearch: FormGroup;
  constructor(private fb: FormBuilder) { }
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
    
  ]  
  ngOnInit(): void {
    this.contentHeader = {
      headerTitle: 'Tìm kiếm',
      actionButton: true,
      breadcrumb: {
        type: 'chevron',
        links: [
          {
            name: 'Thuê bao',
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
    this.formSelectSearch = this.fb.group({
      searchType : [null, Validators.required]
    })
  }
  
  selectSubcriber(e):any{
    if(e.target.value === "thuê bao cá nhân"){
      this.subcriberP = true
      this.subcriberO = false
    }
    if(e.target.value === "thuê bao tổ chức"){
      this.subcriberP = false
      this.subcriberO = true
    }
    
  }

}
