import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-token-view-detail',
  templateUrl: './token-view-detail.component.html',
  styleUrls: ['./token-view-detail.component.scss']
})
export class TokenViewDetailComponent implements OnInit {
  @Input() data: any;
  // public detail property token
  public label 
  constructor() { 
    
  }

  ngOnInit(): void {
    console.log(this.data)
    this.label = this.data.label
  }

}
