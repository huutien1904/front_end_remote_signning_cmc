import { Component, Input, OnInit } from '@angular/core';

export interface ButtonReturn {
  textButton: string;
  actionButton: boolean;
  breadcrumbs?: {
    links?: Array<{
      name?: string;
      isLink?: boolean;
      link?: string;  
    }>;
  };
}
@Component({
  selector: 'app-return',
  templateUrl: './return.component.html',
  styleUrls: ['./return.component.scss']
})
export class ReturnComponent implements OnInit {
  @Input() buttonReturn : ButtonReturn;

  constructor() { }

  ngOnInit(): void {
  }

}
