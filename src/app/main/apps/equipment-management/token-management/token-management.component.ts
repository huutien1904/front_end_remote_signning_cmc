import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import {  FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NgbCalendar, NgbDate, NgbDateParserFormatter } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-token-management',
  templateUrl: './token-management.component.html',
  styleUrls: ['./token-management.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TokenManagementComponent implements OnInit {
  public formListToken: FormGroup;
  public sizePage = [5, 10, 15, 20];
  public moreOption = true;
  public hoveredDate: NgbDate | null = null;
  public fromDate: NgbDate | null;
  public toDate: NgbDate | null;
  public today = this.calendar.getToday();
  public fakedb = [
    {
      no: '1',
      name: 'MÁY 1',
      slot: 3
    },
    {
      no: '2',
      name: 'MÁY 2',
      slot: 4
    },
    {
      no: '3',
      name: 'MÁY 3',
      slot: 5
    }
  ]

  constructor(
    private fb: FormBuilder,
    private calendar: NgbCalendar,
    public formatter: NgbDateParserFormatter
  ) {
    this.fromDate = calendar.getToday();
    this.toDate = calendar.getNext(calendar.getToday(), "d", 10);
  }

  ngOnInit(): void {
    this.formListToken = this.fb.group({
      tokenName: ["", Validators.required]
    })
  }

  
  onSubmit() {
    console.log(this.fb.control);
    alert(this.formListToken.get("fromDate"));
    console.log(this.formListToken.get("fromDate").value);
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
