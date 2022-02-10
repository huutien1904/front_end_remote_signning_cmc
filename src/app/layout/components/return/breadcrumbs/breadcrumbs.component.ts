import { Component, Input, OnInit } from '@angular/core';

export interface Breadcrumbs {
  alignment?: string;
  links?: Array<{
    name: string;
    isLink: boolean;
    link?: string;
  }>;
}

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
})
export class BreadcrumbsComponent implements OnInit {
  @Input() breadcrumbs: Breadcrumbs;
  constructor() { }

  ngOnInit(): void {
    this.breadcrumbs = this.breadcrumbs;
  }

}
