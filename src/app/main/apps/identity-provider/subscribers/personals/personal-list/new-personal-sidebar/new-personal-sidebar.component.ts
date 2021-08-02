import { Component, OnInit } from '@angular/core';
import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';

@Component({
  selector: 'app-new-personal-sidebar',
  templateUrl: './new-personal-sidebar.component.html',
  styleUrls: ['./new-personal-sidebar.component.scss']
})
export class NewPersonalSidebarComponent implements OnInit {
  public fullname;
  public username;
  public email;
  countryBirthPlace:String[] =[
    'Việt Nam',
    'Thái Lan',
    'Lào',
  ]
  provinceBirthPlace:String[] =[
    'Hà Nam',
    'Thài Bình ',
    'Nam Định',
  ]
  districtBirthPlace:String[] =[
    'Lý Nhân',
    'Bình Lục',
    'Thanh Liêm',
  ]
  communeBirthPlace:String[] =[
    'Nhân Nghĩa',
    'Nhân Bình',
    'Xuân Khê',
  ]


  countryResidencePlace:String[] =[
    'Việt Nam',
    'Thái Lan',
    'Lào',
  ]
  provinceResidencePlace:String[] =[
    'Hà Nam',
    'Thài Bình ',
    'Nam Định',
  ]
  districtResidencePlace:String[] =[
    'Lý Nhân',
    'Bình Lục',
    'Thanh Liêm',
  ]
  communeResidencePlace:String[] =[
    'Nhân Nghĩa',
    'Nhân Bình',
    'Xuân Khê',
  ]
  constructor(private _coreSidebarService: CoreSidebarService) { }

  ngOnInit(): void {
  }
  toggleSidebar(name): void {
    this._coreSidebarService.getSidebarRegistry(name).toggleOpen();
  }
  submit(form) {
    if (form.valid) {
      this.toggleSidebar('new-personal-sidebar');
    }
  }
}
