import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';

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
    console.log(event.value)
    const filter = event ? event.value : '';
    this.previousRoleFilter = filter;
    this.temp = this.filterRows(filter, this.previousStatusFilter);
    this.rows = this.temp;
  }
  filterByStatus(event) {
    const filter = event ? event.value: Boolean ;
    this.previousStatusFilter = filter;
    this.temp = this.filterRows(this.previousRoleFilter, filter);
    this.rows = this.temp;

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

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------
  /**
   * On init
   */
  ngOnInit(): void {
    // Subscribe config change
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
