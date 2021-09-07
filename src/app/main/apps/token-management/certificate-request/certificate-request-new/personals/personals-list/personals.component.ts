import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import {  FormBuilder, FormGroup, Validators } from "@angular/forms";
import { CoreSidebarService } from "@core/components/core-sidebar/core-sidebar.service";
import { CoreConfigService } from "@core/services/config.service";
import { NgbCalendar, NgbDate, NgbDateParserFormatter, NgbDateStruct, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { PersonalListService } from "app/main/apps/identity-provider/subscribers/personals/personal-list/personal-list.service";
import { Subject } from "rxjs";
import { PersonalsService } from "./personals.service";

@Component({
  selector: 'app-personals',
  templateUrl: './personals.component.html',
  styleUrls: ['./personals.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PersonalsComponent implements OnInit {
  public rows;
  public moreOption = true
  public page = 0
  public itemOnPage = 3  
  public pageAdvancedEllipses = 1;
  public totalPages:number
  public sizePage = [5,10,15,20]
  public hoveredDate: NgbDate | null = null;
  public fromDate: NgbDate | null;
  public toDate: NgbDate | null;
  public birthDay:NgbDate | null
  public today = this.calendar.getToday();
  sexOption:any[] = [
    "Nam",
    "Nữ",
  ]
  public selectedActive = [];
  
  public searchValue = '';

  // Decorator
  // @ViewChild(DatatableComponent) table: DatatableComponent;
  
  // Private

  // fake db

  private _unsubscribeAll: Subject<any>;
  formListPersonal: FormGroup;

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
    private modalService: NgbModal,
    private fb: FormBuilder,
    private calendar: NgbCalendar,
    public formatter: NgbDateParserFormatter,
    private modal: NgbModal

  ) { 
    this._unsubscribeAll = new Subject();
  }

  // Public Methods
  // -----------------------------------------------------------------------------------------------------
  toggleModal(){
    console.log("output đóng form")
    this.modalService.hasOpenModals();
  }
  toggleSidebar(modalForm) {
    this.modal.open(modalForm, {size: 'lg'})
  }
  closeModal(name){
    this._coreSidebarService.getSidebarRegistry(name).toggleOpen();
  }

  changePage(e){
    console.log(typeof(e))
    this.page = e
    this._userListService.getData(e-1,this.itemOnPage).subscribe((respon:any) =>{
      this.rows = respon.data.data;
    })
  }

  selectItem(e){
    console.log(e)
    const item = Number(e)
    this.itemOnPage = Number(e)
    this._userListService.getData(this.page,item).subscribe((respon:any) =>{
      this.totalPages = respon.data.totalPages * 10
      this.rows = respon.data.data;
    })
  }

  updateTable(){
    this._userListService.getData(this.page,this.itemOnPage).subscribe((respon:any) =>{
      this.rows = respon.data.data;
    })
  }

  onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (
      this.fromDate &&
      !this.toDate &&
      date &&
      date.after(this.fromDate)
    ) {
      this.toDate = date;
    } else {
      this.toDate = null;
      this.fromDate = date;
    }
  }

  isHovered(date: NgbDate) {
    return (
      this.fromDate &&
      !this.toDate &&
      this.hoveredDate &&
      date.after(this.fromDate) &&
      date.before(this.hoveredDate)
    );
  }

  isInside(date: NgbDate) {
    return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
  }

  isRange(date: NgbDate) {
    return (
      date.equals(this.fromDate) ||
      (this.toDate && date.equals(this.toDate)) ||
      this.isInside(date) ||
      this.isHovered(date)
    );
  }
  onSubmit(){
    console.log(this.formListPersonal)
  }
  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------
  /**
   * On init
   */
  ngOnInit(): void {
    this._userListService.getData(this.page,this.itemOnPage).subscribe((respon:any) =>{
      this.totalPages = respon.data.totalPages * 10
      this.rows = respon.data.data;
    })
    this.formListPersonal = this.fb.group({
      inputPersonal: ["", Validators.required],
      fromDate: [null],
      toDate: [null],
      sizePage: [this.sizePage[0]],
      sexOption:[],
      birthDay:[]
    })

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
