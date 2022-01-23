import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-hsm-create-sidebar',
  templateUrl: './hsm-create-sidebar.component.html',
  styleUrls: ['./hsm-create-sidebar.component.scss']
})
export class HsmCreateSidebarComponent implements OnInit {
  @Input() person: any;
  constructor() {
    console.log(this.person)
   }

  ngOnInit(): void {
  }

}
