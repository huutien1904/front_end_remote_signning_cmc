import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ColumnMode, DatatableComponent, } from '@swimlane/ngx-datatable';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { CoreConfigService } from '@core/services/config.service';
import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';
import { PersonalListService } from '../../personals/personal-list/personal-list.service';
import { OrganizationListService } from './organization-list.service';
@Component({
  selector: 'app-organization-list',
  templateUrl: './organization-list.component.html',
  styleUrls: ['./organization-list.component.scss'],
  encapsulation: ViewEncapsulation.None

})
export class OrganizationListComponent implements OnInit {

  public sidebarToggleRef = false;
  public rows;
  public selectedOption = 10;
  public ColumnMode = ColumnMode;
  public temp = [];
  public previousRoleFilter = '';
  public previousPlanFilter = '';
  public previousStatusFilter = '';
  public previousNameFilter = '';


  public selectName: any = [
    { name: 'All', value: '' },
    { name: 'SMV', value: 'SMV' },
    { name: 'CMC', value: 'CMC' },
    { name: 'CIST', value: 'CIST' },
    
  ];

  

  public selectedName = [];
  
  
  public searchValue = '';

  // Decorator
  @ViewChild(DatatableComponent) table: DatatableComponent;

  // fake db
  private tempData = [
    
    
  ];

  private _unsubscribeAll: Subject<any>;

  /**
   * Constructor
   *
   * @param {CoreConfigService} _coreConfigService
    * @param {OrganizationListService} OrganizationListService
   * @param {CoreSidebarService} _coreSidebarService
   */
  constructor(
    private _organizationListService: OrganizationListService,
    private _coreSidebarService: CoreSidebarService,
    private _coreConfigService: CoreConfigService,
    private modalService: NgbModal,
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
    
  }
  openNewOrganizationModal(modal){
    this.modalService.open(modal, {
      centered:true,
      size:'xl'
    });
  }
  toggleModal(){
    this.modalService.dismissAll();
  }



  /**
   * Filter By Roles
   *
   * @param event
   */
  filterByName(event) {
    const filter = event ? event.value : '';
    this.previousRoleFilter = filter;
    this.temp = this.filterRows(filter);
    this.rows = this.temp;
  }

  /**
   * Filter By Plan
   *
   * @param event
   */
  // filterByPlan(event) {
  //   const filter = event ? event.value : '';
  //   this.previousPlanFilter = filter;
  //   this.temp = this.filterRows(this.previousRoleFilter, filter, this.previousStatusFilter);
  //   this.rows = this.temp;
  // }

  /**
   * Filter By Status
   *
   * @param event
   */
  // filterByStatus(event) {
  //   const filter = event ? event.value : '';
  //   this.previousStatusFilter = filter;
  //   this.temp = this.filterRows(this.previousRoleFilter, this.previousPlanFilter, filter);
  //   this.rows = this.temp;
  // }

  /**
   * Filter Rows
   *
   * @param NameFilter
   
   */
  filterRows(nameFilter): any[] {
    // Reset search on select change
    this.searchValue = '';

    nameFilter = nameFilter.toLowerCase();
    

    return this.tempData.filter(row => {
      // const isPartialNameMatch = row.role.toLowerCase().indexOf(roleFilter) !== -1 || !roleFilter;
      const isPartialGenderMatch = row.organizationName.toLowerCase().indexOf(nameFilter) !== -1 || !nameFilter;
      
      return   isPartialGenderMatch ;
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
    this.rows = this._organizationListService.createDb().heroes
    this.tempData = this.rows;
  }
  

}
