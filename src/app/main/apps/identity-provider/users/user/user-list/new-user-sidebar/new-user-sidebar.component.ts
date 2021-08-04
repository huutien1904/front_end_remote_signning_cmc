import { Component, OnInit } from '@angular/core';
import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';

@Component({
  selector: 'app-new-user-sidebar',
  templateUrl: './new-user-sidebar.component.html'
})
export class NewUserSidebarComponent implements OnInit {
  public username;
  public email;
  public password;
  public firstName;
  public lastName;
  public phoneNo;
  public role = [ 'ADMIN', 'SUPERADMIN', 'OPERATOR',   

    'USER-PERSONAL', 'USER-ORGANIZATION', 'USER-SERVICE', 'USER-DEVICE' ];
  public createdAt = new Date();

  /**
   *' Constructor
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
      this.toggleSidebar('new-user-sidebar');
    }
  }

  ngOnInit(): void {}
}

