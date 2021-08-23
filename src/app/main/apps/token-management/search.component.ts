import { Component, OnInit ,ViewEncapsulation} from '@angular/core';


@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  encapsulation: ViewEncapsulation.None
})


export class SearchComponent implements OnInit {
  public keypair = false;
  public request = false;
  public certificate = false;
  public selected
  constructor() { }

  ngOnInit(): void {
  }

  /**
   * 
   * @param event 
   */
  select(event) {
      if(event == 'keypair') {
          this.keypair = true;
          this.request = false;
          this.certificate = false;
      }
      if(event == 'request') {
        this.keypair = false;
        this.request = true;
        this.certificate = false;
    }
    if(event == 'certificate') {
        this.keypair = false;
        this.request = false;
        this.certificate = true;
    }
  }

}