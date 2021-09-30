import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import {
  NgbDate,
  NgbCalendar,
  NgbDateParserFormatter,
} from "@ng-bootstrap/ng-bootstrap";
import { SubscriberCertificateListService } from './subscriber-certificate-list.service';
@Component({
  selector: "app-subscriber-certificate-list",
  templateUrl: "./subscriber-certificate-list.component.html",
  styleUrls: ["./subscriber-certificate-list.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class SubscriberCertificateListComponent implements OnInit {
  //Public Properties
  formListSubscriberCertificate: FormGroup;
  public sizePage = [5, 10, 15, 20];
  public page:number = 0;
  public itemOnPage = 10;
  public pageAdvancedEllipses = 1;
  public totalPages:number
  public moreOption = true;
  public hoveredDate: NgbDate | null = null;
  public fromDate: NgbDate | null;
  public toDate: NgbDate | null;
  public today = this.calendar.getToday();
  public rows: any[];
  minDate: Date;
  constructor(
    private fb: FormBuilder,
    private calendar: NgbCalendar,
    public formatter: NgbDateParserFormatter,
    public _subscriberCertificateService:SubscriberCertificateListService
  ) {
    this.fromDate = calendar.getToday();
    this.toDate = calendar.getNext(calendar.getToday(), "d", 10);
  }

  ngOnInit(): void {

    this._subscriberCertificateService.getData(this.page,this.itemOnPage).subscribe((res:any) =>{
      this.totalPages = res.data.totalPages * 10;
      console.log(res.data.data)
      this.rows = res.data.data;
      this.rows.forEach(item => {
        item.organizationName = this.getOrganization(item);
        item.subscriberName = this.getSubscriber(item);
      })
    })
    
    this.formListSubscriberCertificate = this.fb.group({
      distinguishedName: ["", Validators.required],
      sizePage: [this.sizePage[1]],
      fromDate: [null],
      toDate: [null],
    });
  }
  getOrganization(item): any {
    let info = this._subscriberCertificateService.readCertificate(item.certificate);
    let rs = info.find(obj => obj.name === 'organizationalUnitName');
    if(rs == undefined)
      return;
    return rs.value;
  }
  getSubscriber(item): any {
    let info = this._subscriberCertificateService.readCertificate(item.certificate);
    console.log(info)
    return info.find(obj => obj.name === "commonName").value;
  }
  changePage(e){

  }
  onSubmit() {
    console.log(this.formListSubscriberCertificate.value);
    console.log(this.formListSubscriberCertificate.get("toDate").value);
  }

  /**
   * Range selection Date Picker
   *
   * @param date
   */
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
    this.formListSubscriberCertificate.get("fromDate").setValue(this.fromDate);
    this.formListSubscriberCertificate.get("toDate").setValue(this.toDate);
  }

  /**
   * Is Hovered
   *
   * @param date
   */
  isHovered(date: NgbDate) {
    return (
      this.fromDate &&
      !this.toDate &&
      this.hoveredDate &&
      date.after(this.fromDate) &&
      date.before(this.hoveredDate)
    );
  }

  /**
   * Is Inside
   *
   * @param date
   */
  isInside(date: NgbDate) {
    return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
  }

  /**
   *  Is Range
   *
   * @param date
   */
  isRange(date: NgbDate) {
    return (
      date.equals(this.fromDate) ||
      (this.toDate && date.equals(this.toDate)) ||
      this.isInside(date) ||
      this.isHovered(date)
    );
  }
}
