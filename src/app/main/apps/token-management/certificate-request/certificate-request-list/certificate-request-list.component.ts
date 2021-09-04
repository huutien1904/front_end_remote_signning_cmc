import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import {
  NgbCalendar,
  NgbDate,
  NgbDateParserFormatter,
} from "@ng-bootstrap/ng-bootstrap";
import { CertificateRequestListService } from "./certificate-request-list.service";
@Component({
  selector: "app-certificate-request-list",
  templateUrl: "./certificate-request-list.component.html",
  styleUrls: ["./certificate-request-list.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class CertificateRequestListComponent implements OnInit {
  //Public Properties
  formListCertificateRequest: FormGroup;
  public sizePage = [5, 10, 15, 20];
  public moreOption = true;
  public hoveredDate: NgbDate | null = null;
  public fromDate: NgbDate | null;
  public toDate: NgbDate | null;
  public today = this.calendar.getToday();
  constructor(
    private fb: FormBuilder,
    private calendar: NgbCalendar,
    public formatter: NgbDateParserFormatter,
    private listService: CertificateRequestListService
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
    this.listService.getData(pageSize, page).subscribe((response: any) => {
      this.list = response.data.data;
      this.listTemp = response.data.data
      this.total = response.data.totalItems;
      this.selectedOption = pageSize
      console.log(this.list);
      for(let item of this.list) {
        console.log(item.certificateRequest);
      }
    });
  }

  ngOnInit(): void {
    this.formListCertificateRequest = this.fb.group({
      distinguishedName: ["", Validators.required],
      sizePage: [this.sizePage[1]],
      fromDate: [null],
      toDate: [null],
    });

    this.getDataTable(10, 1);
  }

    //Chuyen trang
    load(event) {
      this.pageNo = event;
      this.getDataTable(this.formListCertificateRequest.controls['sizePage'].value, this.pageNo);
    }
    //Doi so luong dong tren 1 trang
    changePageSize(event) {
      console.log(event);
      this.getDataTable(event, 1);
    }

  onSubmit() {
    console.log(this.fb.control);
    alert(this.formListCertificateRequest.get("fromDate"));
    console.log(this.formListCertificateRequest.get("fromDate").value);
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
