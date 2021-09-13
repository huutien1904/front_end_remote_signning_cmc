import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import {  FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NgbCalendar, NgbDate, NgbDateParserFormatter } from "@ng-bootstrap/ng-bootstrap";
import { HsmlistService } from "./hsmlist.service";
import { Subject } from 'rxjs';

@Component({
  selector: 'app-hsm-management',
  templateUrl: './hsm-management.component.html',
  styleUrls: ['./hsm-management.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HsmManagementComponent implements OnInit {
  public rows: any[];
  public page = 0;
  public itemOnPage = 10;
  public pageAdvancedEllipses = 1;
  public totalPages:number
  public formListHSM: FormGroup;
  public sizePage = [5, 10, 15, 20];
  public moreOption = true;
  public hoveredDate: NgbDate | null = null;
  public fromDate: NgbDate | null;
  public toDate: NgbDate | null;
  public today = this.calendar.getToday();
  private _unsubscribeAll: Subject<any>;
  public fakedb = [
    {
      no: '1',
      name: 'MÁY 1',
      company: 'utimaco',
      model: 'mm',
      hardwareid: 'HSM-001',
      librarypath: 'Máy 1'
    },
    {
      no: '2',
      name: 'MÁY 2',
      company: 'utimaco',
      model: 'mm',
      hardwareid: 'HSM-002',
      librarypath: 'Máy 2'
    },
    {
      no: '3',
      name: 'MÁY 3',
      company: 'utimaco',
      model: 'mm',
      hardwareid: 'HSM-003',
      librarypath: 'Máy 3'
    }
  ]

  constructor(
    private fb: FormBuilder,
    private calendar: NgbCalendar,
    public formatter: NgbDateParserFormatter,
    private _hsmService: HsmlistService
  ) {
    this.fromDate = calendar.getToday();
    this.toDate = calendar.getNext(calendar.getToday(), "d", 10);
  }

  ngOnInit(): void {
    this._hsmService.getData(this.page,this.itemOnPage).subscribe((respon:any) =>{
      this.totalPages = respon.data.totalPages * 10
      this.rows = respon.data;
    })
    this.formListHSM = this.fb.group({
      hsmName: ["", Validators.required],
      sizePage: [this.sizePage[1]],
      fromDate: [null],
      toDate: [null]
    })
  }


    //Chuyen trang
    changePage(e){
      console.log(typeof(e))
      this.page = e
      this._hsmService.getData(e-1,this.itemOnPage).subscribe((respon:any) =>{
        this.rows = respon.data.data;
      })
    }
    //Doi so luong dong tren 1 trang
    selectItem(e){
      console.log(e)
      const item = Number(e)
      this.itemOnPage = Number(e)
      this._hsmService.getData(this.page,item).subscribe((respon:any) =>{
        this.totalPages = respon.data.totalPages * 10
        this.rows = respon.data.data;
      })
    }

  onSubmit() {
    console.log(this.fb.control);
    alert(this.formListHSM.get("fromDate"));
    console.log(this.formListHSM.get("fromDate").value);
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
  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
