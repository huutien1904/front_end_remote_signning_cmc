import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import {  FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NgbCalendar, NgbDate, NgbDateParserFormatter, NgbDateStruct, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { PersonalsService } from "./personals.service";

@Component({
  selector: 'app-personals',
  templateUrl: './personals.component.html',
  styleUrls: ['./personals.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PersonalsComponent implements OnInit {
  public basicDPdata: NgbDateStruct;
  public formListPersonals: FormGroup;
  public sizePage = [5, 10, 15, 20];
  public sex = ['Nam', 'Nữ', 'Khác']
  public moreOption = true;
  public hoveredDate: NgbDate | null = null;
  public fromDate: NgbDate | null;
  public toDate: NgbDate | null;
  public today = this.calendar.getToday();
  
  constructor(
    private fb: FormBuilder,
    private calendar: NgbCalendar,
    public formatter: NgbDateParserFormatter,
    private personalListService: PersonalsService,
    private modal: NgbModal
  ) {
    this.fromDate = calendar.getToday();
    this.toDate = calendar.getNext(calendar.getToday(), "d", 10);
  }

  //Table
  public list: any;
  public listTemp: any;
  public selectedOption = 10;
  public pageNo = 1;
  public total;

  //Truyen du lieu ra bang
  getDataTable(pageSize, page) {
    this.personalListService.getData(pageSize, page).subscribe((response: any) => {
      this.list = response.data.data;
      this.listTemp = response.data.data
      this.total = response.data.totalItems;
      this.selectedOption = pageSize;
      console.log(this.list);
    });
  }

  ngOnInit(): void {
    this.formListPersonals = this.fb.group({
      searchName: ["", Validators.required],
      sizePage: [this.sizePage[1]],
      fromDate: [null],
      toDate: [null],
      sex: [""],
      birthdya: [null]
    })
    this.getDataTable(10, 1);
    
  }
  //Chuyen trang
  load(event) {
    this.pageNo = event;
    this.getDataTable(this.formListPersonals.controls['sizePage'].value, this.pageNo);
  }
  //Doi so luong dong tren 1 trang
  changePageSize(event) {
    console.log(event);
    this.getDataTable(event, 1);
  }
  //Mo tao yeu cau chung thuc
  toggleSidebar(modalForm) {
    this.modal.open(modalForm, {size: 'lg'})
  }



  onSubmit() {
    const searchValue = this.formListPersonals.get('searchName').value;
    console.log(searchValue);

    const dataAfterFilter = this.listTemp.filter(function (d) {
      d.fullName =  d.personalLastName + ' ' + d.personalMiddleName + ' ' + d.personalFirstName;
      return (d.fullName.indexOf(searchValue) !== -1 || d.email.indexOf(searchValue) !== -1 ||  !searchValue);
    })
    this.list = dataAfterFilter;
    this.total = dataAfterFilter.length;
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

}
