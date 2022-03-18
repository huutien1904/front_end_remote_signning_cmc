import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-help-center',
  templateUrl: './help-center.component.html',
  styleUrls: ['./help-center.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HelpCenterComponent implements OnInit {
    // public
    public contentHeader: object;
    public searchText: string;
  constructor() { }

  ngOnInit() {
  }

}
