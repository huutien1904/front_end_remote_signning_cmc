import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';

import { ColumnMode, DatatableComponent, } from '@swimlane/ngx-datatable';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { CoreConfigService } from '@core/services/config.service';
import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';
import { PersonalListService } from './personal-list.service';


import {
  BTable, BFormCheckbox, BAvatar, BBadge,
} from 'bootstrap-vue'
@Component({
  selector: 'app-personal-list',
  templateUrl: './personal-list.component.html',
  styleUrls: ['./personal-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PersonalListComponent implements OnInit {
  
  public sidebarToggleRef = false;
  public rows;
  public selectedOption = 10;
  public ColumnMode = ColumnMode;
  public temp = [];
  public previousRoleFilter = '';
  public previousPlanFilter = '';
  public previousStatusFilter = '';

  public selectRole: any = [
    { name: 'All', value: '' },
    { name: 'Admin', value: 'Admin' },
    { name: 'Author', value: 'Author' },
    { name: 'Editor', value: 'Editor' },
    { name: 'Maintainer', value: 'Maintainer' },
    { name: 'Subscriber', value: 'Subscriber' }
  ];

  public selectPlan: any = [
    { name: 'All', value: '' },
    { name: 'Basic', value: 'Basic' },
    { name: 'Company', value: 'Company' },
    { name: 'Enterprise', value: 'Enterprise' },
    { name: 'Team', value: 'Team' }
  ];

  public selectStatus: any = [
    { name: 'All', value: '' },
    { name: 'Pending', value: 'Pending' },
    { name: 'Active', value: 'Active' },
    { name: 'Inactive', value: 'Inactive' }
  ];

  public selectedRole = [];
  public selectedPlan = [];
  public selectedStatus = [];
  public searchValue = '';

  // Decorator
  @ViewChild(DatatableComponent) table: DatatableComponent;

  // Private

  // fake db
  private tempData = [
      {
        id: 1,
        fullName: 'Nguyễn Văn An',
        
        email: 'gslixby0@abc.net.au',
        currentPlan: 'Enterprise',
        organization: 'vin',
        avatar: '',
        passPort:'035200001170',
        numberLetter:2
      },
      {
        id: 2,
        fullName: 'Trần Thị Mến',
               email: 'hredmore1@imgur.com',
        currentPlan: 'Team',
        organization: 'mec',
        avatar: 'assets/images/avatars/10.png',
        passPort:'035200001170',
        numberLetter:3
      },
      {
        id: 3,
        fullName: 'Nguyễn Viết Hoàng',
        
        email: 'msicely2@who.int',
        currentPlan: 'Enterprise',
        organization: 'liv',
        avatar: 'assets/images/avatars/1.png',
        passPort:'035200001170',
        numberLetter:4
      },
      {
        id: 4,
        fullName: 'Phạm Cao Cường',
        
        email: 'crisby3@wordpress.com',
        currentPlan: 'Team',
        organization: 'vin',
        avatar: 'assets/images/avatars/9.png',
        passPort:'035200001170',
        numberLetter:5
      },
      {
        id: 5,
        fullName: 'Nguyễn Tiến Minh',
                email: 'mhurran4@yahoo.co.jp',
        currentPlan: 'Enterprise',
        organization: 'mec',
        avatar: 'assets/images/avatars/10.png',
        passPort:'035200001170',
        numberLetter:2
      },
      {
        id: 6,
        fullName: 'Lương Minh Trang ',
               email: 'shalstead5@shinystat.com',
        currentPlan: 'Company',
        organization: 'liv',
        avatar: '',
        passPort:'035200001170',
        numberLetter:1
      },
      {
        id: 7,
        fullName: 'Vũ Thị Huệ',
                email: 'bgallemore6@boston.com',
        currentPlan: 'Company',
        organization: 'vin',
        avatar: '',
        passPort:'035200001170',
        numberLetter:3
      },
      {
        id: 8,
        fullName: 'Đỗ Hùng Dũng',
               email: 'kliger7@vinaora.com',
        currentPlan: 'Enterprise',
        organization: 'mec',
        avatar: 'assets/images/avatars/9.png',
        passPort:'035200001170',
        numberLetter:0
      },
      {
        id: 9,
        fullName: 'Phạm Văn Nam',
               email: 'fscotfurth8@dailymotion.com',
        currentPlan: 'Team',
        organization: 'liv',
        avatar: 'assets/images/avatars/2.png',
        passPort:'035200001170',
        numberLetter:2
      },
      {
        id: 10,
        fullName: 'Vũ Việt Hoàng',
               email: 'jbellany9@kickstarter.com',
        currentPlan: 'Company',
        organization: 'vin',
        avatar: 'assets/images/avatars/9.png',
        passPort:'035200001170',
        

      },
      {
        id: 11,
        fullName: 'Vũ Việt Hoàng',
               email: 'jbellany9@kickstarter.com',
        currentPlan: 'Company',
        organization: 'vin',
        avatar: 'assets/images/avatars/9.png',
        passPort:'035200001170',
        

      },
      {
        id: 12,
        fullName: 'Vũ Việt Hoàng',
               email: 'jbellany9@kickstarter.com',
        currentPlan: 'Company',
        organization: 'vin',
        avatar: 'assets/images/avatars/9.png',
        passPort:'035200001170',
        

      },
  ];

  private _unsubscribeAll: Subject<any>;

  /**
   * Constructor
   *
   * @param {CoreConfigService} _coreConfigService
   * @param {UserListService} PersonalListService
   * @param {CoreSidebarService} _coreSidebarService
   */
  constructor(
    // private _userListService: PersonalListService,
    private _coreSidebarService: CoreSidebarService,
    private _coreConfigService: CoreConfigService
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
  // to search 
   filterUpdate(event) {
    // Reset ng-select on search
    this.selectedRole = this.selectRole[0];
    this.selectedPlan = this.selectPlan[0];
    this.selectedStatus = this.selectStatus[0];

    const val = event.target.value.toLowerCase();

    // Filter Our Data
    const temp = this.tempData.filter(function (d) {
      return d.fullName.toLowerCase().indexOf(val) !== -1 || !val;
    });

    // Update The Rows
    this.rows = temp;
    // Whenever The Filter Changes, Always Go Back To The First Page
    this.table.offset = 0;
  }

  /**
   * Toggle the sidebar
   *
   * @param name
   */
  toggleSidebar(name): void {
    // alert(name);
    this._coreSidebarService.getSidebarRegistry(name).toggleOpen();
  }

  /**
   * Filter By Roles
   *
   * @param event
   */
  filterByRole(event) {
    const filter = event ? event.value : '';
    this.previousRoleFilter = filter;
    this.temp = this.filterRows(filter, this.previousPlanFilter, this.previousStatusFilter);
    this.rows = this.temp;
  }

  /**
   * Filter By Plan
   *
   * @param event
   */
  filterByPlan(event) {
    const filter = event ? event.value : '';
    this.previousPlanFilter = filter;
    this.temp = this.filterRows(this.previousRoleFilter, filter, this.previousStatusFilter);
    this.rows = this.temp;
  }

  /**
   * Filter By Status
   *
   * @param event
   */
  filterByStatus(event) {
    const filter = event ? event.value : '';
    this.previousStatusFilter = filter;
    this.temp = this.filterRows(this.previousRoleFilter, this.previousPlanFilter, filter);
    this.rows = this.temp;
  }

  /**
   * Filter Rows
   *
   * @param roleFilter
   * @param planFilter
   * @param statusFilter
   */
  filterRows(roleFilter, planFilter, statusFilter): any[] {
    // Reset search on select change
    this.searchValue = '';

    roleFilter = roleFilter.toLowerCase();
    planFilter = planFilter.toLowerCase();
    statusFilter = statusFilter.toLowerCase();

    return this.tempData.filter(row => {
      // const isPartialNameMatch = row.role.toLowerCase().indexOf(roleFilter) !== -1 || !roleFilter;
      const isPartialGenderMatch = row.currentPlan.toLowerCase().indexOf(planFilter) !== -1 || !planFilter;
      const isPartialStatusMatch = row.organization.toLowerCase().indexOf(statusFilter) !== -1 || !statusFilter;
      return  isPartialGenderMatch && isPartialStatusMatch;
    });
  }
  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------
  /**
   * On init
   */
  ngOnInit(): void {
    // Subscribe config change
    // this._coreConfigService.config.pipe(takeUntil(this._unsubscribeAll)).subscribe(config => {
    //   //! If we have zoomIn route Transition then load datatable after 450ms(Transition will finish in 400ms)
    //   if (config.layout.animation === 'zoomIn') {
    //     setTimeout(() => {
    //       this._userListService.onUserListChanged.pipe(takeUntil(this._unsubscribeAll)).subscribe(response => {
    //         this.rows = response;
    //         this.tempData = this.rows;
    //       });
    //     }, 450);
    //   } else {
    //     this._userListService.onUserListChanged.pipe(takeUntil(this._unsubscribeAll)).subscribe(response => {
    //       this.rows = response;
    //       this.tempData = this.rows;
    //     });
    //   }
    // });
    this.rows = this.tempData
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
