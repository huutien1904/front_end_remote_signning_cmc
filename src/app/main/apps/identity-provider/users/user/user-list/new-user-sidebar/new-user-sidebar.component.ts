import { Component, OnInit } from '@angular/core';
import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';

@Component({
  selector: 'app-new-user-sidebar',
  templateUrl: './new-user-sidebar.component.html',
  styleUrls: ['./new-user-sidebar.component.scss'],
})
export class NewUserSidebarComponent implements OnInit {
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
  /**
   * Constructor
   *
   * @param {CoreSidebarService} _coreSidebarService
   */
  constructor(private _coreSidebarService: CoreSidebarService) {}

  /**
   * Toggle the sidebar
   *
   * @param name
   */
  toggleSidebar(name): void {
    this._coreSidebarService.getSidebarRegistry(name).toggleOpen();
  }

  /**
   * Submit
   *
   * @param form
   */
  submit(form) {
    if (form.valid) {
      this.toggleSidebar('new-personal-sidebar');
    }
  }

  ngOnInit(): void {}
}
