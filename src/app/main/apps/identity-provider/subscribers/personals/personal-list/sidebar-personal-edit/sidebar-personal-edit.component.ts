import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-sidebar-personal-edit',
  templateUrl: './sidebar-personal-edit.component.html',
  styleUrls: ['./sidebar-personal-edit.component.scss']
})
export class SidebarPersonalEditComponent implements OnInit {
  @Input() personal: any;
  
  constructor() { }

  ngOnInit(): void {
  }

}
