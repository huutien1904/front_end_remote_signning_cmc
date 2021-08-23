import { Component, OnInit ,ViewEncapsulation} from '@angular/core';


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
  constructor() { }

  ngOnInit(): void {
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
