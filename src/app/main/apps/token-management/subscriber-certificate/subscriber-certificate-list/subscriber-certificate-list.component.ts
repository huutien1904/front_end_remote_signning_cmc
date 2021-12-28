import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import {
  NgbDate,
  NgbCalendar,
  NgbDateParserFormatter,
} from "@ng-bootstrap/ng-bootstrap";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
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
  public contentHeader: object;
  public isLoading: boolean = false;
  private _unsubscribeAll: Subject<any>;

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

    this.contentHeader = {
      headerTitle: 'Danh sách',
      actionButton: true,
      breadcrumb: {
        type: 'chevron',
        links: [
          {
            name: 'Quản lý cặp khóa',
            isLink: false
          },
          {
            name: 'Danh sách chứng thư số',
            isLink: true,
            link: 'apps/tm/subscriber-certificate/subscriber-certificate-list'
          }
        ]
      }
    };

    // this._subscriberCertificateService.getData(body).subscribe((res:any) =>{
    //   this.totalPages = res.data.totalPages * 10;
    //   console.log(res.data.data)
    //   this.rows = res.data.data;
    //   this.rows.forEach(item => {
    //     item.organizationName = this.getOrganization(item);
    //     item.subscriberName = this.getSubscriber(item);
    //   })
    // })
    
    // page: [null],
    //   size: [this.sizePage[1]],
    //   sort : [null],
    //   contains: [null],
    //   fromDate: [null],
    //   toDate: [null],
    this.formListSubscriberCertificate = this.fb.group({
      page: [null],
      size: [this.sizePage[1]],
      sort : [null],
      contains: ["", Validators.required],
      fromDate: [null],
      toDate: [null],
    });
    this.setPage({ offset: 0, pageSize: this.formListSubscriberCertificate.get('size').value });
  }
  setPage(pageInfo) {
    
    console.log(pageInfo);
    this.isLoading = true;
    this.formListSubscriberCertificate.patchValue({"page":pageInfo.offset});
    console.log(JSON.stringify(this.formListSubscriberCertificate.value))
    this._subscriberCertificateService
      .getData(JSON.stringify(this.formListSubscriberCertificate.value))
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((pagedData) => {
        console.log(pagedData)
        // this.pagedData = pagedData.data;
        // this.rowsData = pagedData.data.data;
        // console.log(this.rowsData)
        // this.rowsData = pagedData.data.data.map(item => ({
        //   ...item,
        //   organizationName: this.getOrganization(item),
        //   subscribeName: this.getSubscribe(item)
        // }))
        // this.isLoading=false;
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
