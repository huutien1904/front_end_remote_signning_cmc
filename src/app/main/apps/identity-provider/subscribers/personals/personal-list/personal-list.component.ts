import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';

import { ColumnMode, DatatableComponent, } from '@swimlane/ngx-datatable';
import { takeUntil } from 'rxjs/operators';

import { Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CoreConfigService } from '@core/services/config.service';
import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';
import { PersonalListService } from './personal-list.service';



@Component({
  selector: 'app-personal-list',
  templateUrl: './personal-list.component.html',
  styleUrls: ['./personal-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PersonalListComponent implements OnInit {
  
  public sidebarToggleRef = false;
  public showTableContent= false;
  public rows;
  public selectedOption = 10;
  public ColumnMode = ColumnMode;
  public temp = [];
  public pageBasicText = 1;
  public previousOganizationFilter = '';
  public previousActiveFilter = '';
  public page = 0
  public itemOnPage = 12  
  public changeAB = false
  public pageSizes = [
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    11,
    12
  ]
  public selectSex: any = [

    { name: 'Nam', value: 'Name' },
    { name: 'Nữ', value: 'Nữ' },
    
    
  ];

  public selectActive: any = [
    { name: 'All', value: '' },
    { name: 'Hoạt động', value: 'hoạt động' },
    { name: 'Không hoạt động', value: 'không hoạt động' }
  ];

  
  public slectedSex = [];
  public selectedActive = [];
  
  public searchValue = '';

  // Decorator
  @ViewChild(DatatableComponent) table: DatatableComponent;

  // Private

  // fake db
  private tempData = [];

  private _unsubscribeAll: Subject<any>;

  /**
   * Constructor
   *
   * @param {CoreConfigService} _coreConfigService
   * @param {UserListService} PersonalListService
   * @param {CoreSidebarService} _coreSidebarService
   * @param {NgbModal} modalService
  */

  constructor(
    private _userListService: PersonalListService,
    private _coreSidebarService: CoreSidebarService,
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
  // to search 
   filterUpdate(event) {
    // Reset ng-select on search
    // this.slectedOrganization = this.selectOganization[0];
    // this.selectedActive = this.selectActive[0];
    // // this.selectedStatus = this.selectStatus[0];

    // const val = event.target.value.toLowerCase();

    // // Filter Our Data
    // const temp = this.tempData.filter(function (d) {
    //   return d.fullName.toLowerCase().indexOf(val) !== -1 || !val;
    // });

    // // Update The Rows
    // this.rows = temp;
    // // Whenever The Filter Changes, Always Go Back To The First Page
    // this.table.offset = 0;
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
  
  // toggleSidebar(modalForm) {
  //   this.modalService.open(modalForm);
  // }
  /**
   * Filter By active
   *
   * @param event
   */
  filterByActive(event) {
    
    const filter = event ? event.value : '';
    this.previousActiveFilter = filter;
    this.temp = this.filterRows(this.previousOganizationFilter, filter);
    this.rows = this.temp;
  }

  

  filterByOganization(event){
    const filter = event ? event.value : '';
    this.previousOganizationFilter = filter;
    this.temp = this.filterRows( filter, this.previousActiveFilter);
    this.rows = this.temp;
    
  }
  

  
  filterRows(organizationFilter, activeFilter): any[] {
  //  this.showTableContent= true;

    // Reset search on select change
    this.searchValue = '';
    // load data
    // this.rows = this._userListService.createDb().heroes
    // this.tempData = this.rows;

    organizationFilter = organizationFilter.toLowerCase();
    activeFilter = activeFilter.toLowerCase();

    return this.tempData.filter(row => {
      console.log(!organizationFilter)
      const isPartialGenderMatch = row.organization.toLowerCase().indexOf(organizationFilter) !== -1 || !organizationFilter;
      const isPartialNameMatch = row.active.toLowerCase().indexOf(activeFilter) !== -1 || !activeFilter;
      
      return  isPartialGenderMatch && isPartialNameMatch
    }); 
  }
  handBirthDay(birthday){
    const year = birthday.slice(0,4)
    const month = birthday.slice(4,6)
    const day = birthday.slice(6,8)
    const add = '-'
    const so = '0'
    return year.concat(add,month,add,so,day)
  }
  addIndex(myArrays){
    myArrays.map((array,index) =>{
      return (
        array.index = index + 1,
        array.birthday = this.handBirthDay(array.birthday)
      )
    })
    return myArrays
  }
  changePage(e){
    console.log(typeof(e))
    this.page = e
    this._userListService.getData(e-1,this.itemOnPage).subscribe((respon:any) =>{
      this.rows = respon.data.data;
            this.tempData = this.rows;
    })
  }
  selectItem(e){
    const item = Number(e.target.value)
    this._userListService.getData(this.page,item).subscribe((respon:any) =>{
      this.rows = respon.data.data;
            this.tempData = this.rows;
    })
  }
  changeAb(){
    this.changeAB =! this.changeAB
  }
  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------
  /**
   * On init
   */
  ngOnInit(): void {
    this._userListService.getData(this.page,this.itemOnPage).subscribe((respon:any) =>{
      this.rows = this.addIndex(respon.data.data);
            this.tempData = this.rows;
    })
    // console.log(this.rows)
    // this.tempData = this.rows;
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
    //       this.rows = this.addIndex(response.data.data)
    //       console.log(this.rows)
    //       this.tempData = this.rows;
    //     });
    //   }
    // });
    // this._userListService.getProvice()
    // console.log(this.row)
    // this.rows = this._userListService.createDb().heroes
    // this.tempData = this.rows;
    
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
