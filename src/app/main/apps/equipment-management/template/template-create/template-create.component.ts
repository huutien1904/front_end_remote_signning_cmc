import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-template-create',
  templateUrl: './template-create.component.html',
  styleUrls: ['./template-create.component.scss']
})
export class TemplateCreateComponent implements OnInit {

  // public 
  public contentHeader: object;

  
  constructor() { }

  ngOnInit(): void {
    this.contentHeader = {
      headerTitle: 'Tạo mới template',
      actionButton: true,
      breadcrumb: {
        type: 'chevron',
        links: [
          {
            name: 'Danh sách Template',
            isLink: true,
            link: '/apps/equipment-management/template/template-list',
          },
          {
            name: 'Tạo mới Template',
            isLink: false,
          },
        ],
      },
    };
  }

}
