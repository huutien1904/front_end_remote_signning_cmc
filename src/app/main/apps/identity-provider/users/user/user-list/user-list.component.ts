import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ColumnMode,  DatatableComponent } from '@swimlane/ngx-datatable';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { CoreConfigService } from '@core/services/config.service';
import { UserListService } from './user-list.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';




@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class UserListComponent implements OnInit {
  // Public
  public rows;
  public selectedOption = 10;
  public ColumnMode = ColumnMode;
  public temp = [];
  public previousRoleFilter = '';
  public previousStatusFilter: boolean;
  public isActive: boolean;
  public show= false;
  public pageNo = 1;
  public total;
  public countItems;

  public selectRole: any = [
    { name: 'Tất cả', value: '' },
    { name: 'ADMIN', value: 'ADMIN' },
    { name: 'SUPERADMIN', value: 'SUPERADMIN' },
    { name: 'OPERATOR', value: 'OPERATOR' },
    { name: 'USER-PERSONAL', value: 'USER-PERSONAL' },
    { name: 'USER-ORGANIZATION', value: 'USER-ORGANIZATION' },
    { name: 'USER-SERVICE', value: 'USER-SERVICE'},
    { name: 'USER-DEVICE', value: 'USER-DEVICE'}
  ];
  public selectStatus: any = [
    { name: 'Tất cả', value: null },
    { name: 'Có', value: true },
    { name: 'Không', value: false }
  ];

  public selectedRole = [];
  public selectedStatus = [];
  public searchValue = '';

  // Decorator
  @ViewChild(DatatableComponent) table: DatatableComponent;

  // Private
  private tempData = [];
  private _unsubscribeAll: Subject<any>;

  /**
   * Constructor
   *
   * @param {CoreConfigService} _coreConfigService
   * @param {UserListService} _userListService
   * @param {NgbModal} modalService
   */
  constructor(
    private _userListService: UserListService,
    private _coreConfigService: CoreConfigService,
    private modalService: NgbModal
  ) {
    this._unsubscribeAll = new Subject();
  }

  // Public Methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * filterUpdate
   *
   * @param event
   */
  filterUpdate(event) {
    // Reset ng-select on search
    this.selectedRole = this.selectRole[0];
    this.selectedStatus = this.selectStatus[0];

    const val = event.target.value;

    // Filter Our Data
    const temp = this.tempData.filter(function (d) {
      d.fullName = d.firstName + ' ' + d.lastName;
      return d.fullName.indexOf(val) !== -1 || !val;
    });

    // Update The Rows
    this.rows = temp;
    // Whenever The Filter Changes, Always Go Back To The First Page
    this.table.offset = 0;
  }

  /**
   * Toggle the sidebar
   *
   * 
   */
  toggleSidebar(modalForm) {
    this.modalService.open(modalForm, {size: 'lg'});
  }

  /**
   * Filter By Roles
   *
   * @param event
   */
  filterByRole(event) {
    const filter = event ? event.value : '';
    this.previousRoleFilter = filter;
    this.temp = this.filterRows(filter, this.previousStatusFilter);
    this.rows = this.temp;
    this.countItems = this.rows.length;
  }
  /**
   * Filter By Status
   *
   * @param event
   */
  filterByStatus(event) {
    const filter = event ? event.value: Boolean ;
    this.previousStatusFilter = filter;
    this.temp = this.filterRows(this.previousRoleFilter, filter);
    this.rows = this.temp;
    this.countItems = this.rows.length;
  }

  /**
   * Filter Rows
   *
   * @param roleFilter
   * @param statusFilter
   */
  filterRows(roleFilter, statusFilter): any[] {
    // Reset search on select change
    this.searchValue = '';
    this.show = true;
    return this.tempData.filter(row => {

      const isPartialNameMatch = row.userRole.roleName.localeCompare(roleFilter) == 0 || !roleFilter;
      const isPartialStatusMatch = (row.isActive == statusFilter) || statusFilter == null;

      return isPartialNameMatch && isPartialStatusMatch;
    });
  }

  /**
   * @param event
   */
  filterByNumberItems(event) {
    this.getData(this.creatParams(1, event));
  }
  
  /**
   * 
   * @param page 
   * @param pageSize 
   * @returns 
   */
  creatParams(page, pageSize) {
    const params = {};
    params['page'] = page - 1;
    params['pageSize'] = pageSize;
    return params;
  }

  /**
   * 
   * @param params 
   */
  getData(params) {
    this._userListService.getTestApi(params).subscribe((response: any) => {
      this.rows = response.data.data;
      this.tempData = this.rows;
      this.total = response.data.totalItems;
      this.countItems = this.rows.length;
      console.log('So luong phan tu ' + this.countItems);
      console.log('Danh sach: ' + this.rows);
    })
  }

  /**
   * 
   * @param event 
   */
  load(event) {
    this.pageNo = event;
    this.getData(this.creatParams(this.pageNo, this.selectedOption));
  }

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------
  /**
   * On init
   */
  ngOnInit(): void {
    this.getData(this.creatParams(1, this.selectedOption));
    // Subscribe config change
    /*
    this._coreConfigService.config.pipe(takeUntil(this._unsubscribeAll)).subscribe(config => {
      //! If we have zoomIn route Transition then load datatable after 450ms(Transition will finish in 400ms)
      if (config.layout.animation === 'zoomIn') {
        setTimeout(() => {
          this._userListService.onUserListChanged.pipe(takeUntil(this._unsubscribeAll)).subscribe(response => {
            this.rows = response;
            this.tempData = this.rows;
          });
        }, 450);
      } else {
        this._userListService.onUserListChanged.pipe(takeUntil(this._unsubscribeAll)).subscribe(response => {
          this.rows = response;
          this.tempData = this.rows;
        });
      }
    });
    */
  }


  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
/*
creatParams(page, pageSize) {
  const params = {};
  params['page'] = page;
  params['pageSize'] = pageSize;
  return params;
}
getData(params) {
  this._userListService.getTestApi(params).subscribe((response: any) => {
    this.rows = response.data.data;
    this.total = response.data.totalItems;
    console.log(this.rows);
    console.log(this.total);
  })
}
load(event) {
  this.pageAdvancedNoEllipses = event;
  console.log(this.pageAdvancedNoEllipses);
  this.getData(this.creatParams(this.pageAdvancedNoEllipses, 2));
}
  getTestApi(x: any): any{
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const token = currentUser.token;
    const option = {
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
      },
      params: {
        "page": x.page,
        "size": x.pageSize
      }
    };
    console.log(x);
    console.log(this.rows)
    return this._httpClient.get(`${environment.apiUrl}/user/list`, option);
  }
*/
