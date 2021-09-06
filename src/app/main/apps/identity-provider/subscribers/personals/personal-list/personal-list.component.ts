import { Component, OnInit, ViewChild, ViewEncapsulation ,TemplateRef} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CoreConfigService } from '@core/services/config.service';
import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';
import { PersonalListService } from './personal-list.service';
import { NgbDate, NgbCalendar, NgbDateParserFormatter } from "@ng-bootstrap/ng-bootstrap";
import { TablePersonalListComponent } from './table-personal-list/table-personal-list.component';



@Component({
  selector: 'app-personal-list',
  templateUrl: './personal-list.component.html',
  styleUrls: ['./personal-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class PersonalListComponent implements OnInit {
  
  @ViewChild(TablePersonalListComponent) tablePersonalList;
  public typeListPersonal = "listPersonal";
  public rows;
  public page = 0
  public moreOption = true;
  public itemOnPage = 5  
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
  private _unsubscribeAll: Subject<any>;
  formListPersonal: FormGroup;

  /**
   * Constructor
   *
   * @param {UserListService} PersonalListService
   * @param {CoreSidebarService} _coreSidebarService
   * @param {NgbModal} modalService
  */

  constructor(
    private _userListService: PersonalListService,
    private _coreSidebarService: CoreSidebarService,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private calendar: NgbCalendar,
    public formatter: NgbDateParserFormatter

  ) { 
    this._unsubscribeAll = new Subject();
  }

  // Public Methods
  // -----------------------------------------------------------------------------------------------------
  toggleModal(){
    console.log("output đóng form")
    this.modalService.hasOpenModals();
  }
  openNewPersonalModal(modal){
    this.modalService.open(modal, {
      centered:true,
      size:'xl'
    });
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
    this.tablePersonalList.selectItem(this.formListPersonal.get('sizePage').value);
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
      this.totalPages = respon.data.totalPages * 10;
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
