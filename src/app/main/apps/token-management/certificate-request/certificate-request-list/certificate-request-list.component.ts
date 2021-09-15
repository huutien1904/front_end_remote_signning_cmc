import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import {
  NgbCalendar,
  NgbDate,
  NgbDateParserFormatter,
} from "@ng-bootstrap/ng-bootstrap";
import { CertificateRequestListService } from "./certificate-request-list.service";
import { Subject } from 'rxjs';
@Component({
  selector: "app-certificate-request-list",
  templateUrl: "./certificate-request-list.component.html",
  styleUrls: ["./certificate-request-list.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class CertificateRequestListComponent implements OnInit {
  //Public Properties
  public rows: any[];
  public page = 0;
  public itemOnPage = 10;
  public pageAdvancedEllipses = 1;
  public totalPages:number
  public formListCertificateRequest: FormGroup;
  public sizePage = [5, 10, 15, 20];
  public moreOption = true;
  public hoveredDate: NgbDate | null = null;
  public fromDate: NgbDate | null;
  public toDate: NgbDate | null;
  public today = this.calendar.getToday();

  private _unsubscribeAll: Subject<any>;

  constructor(
    private fb: FormBuilder,
    private calendar: NgbCalendar,
    public formatter: NgbDateParserFormatter,
    private _listCerReqService: CertificateRequestListService
  ) {
    this.fromDate = calendar.getToday();
    this.toDate = calendar.getNext(calendar.getToday(), "d", 10);
  }

  ngOnInit(): void {
    this._listCerReqService.getData(this.page,this.itemOnPage).subscribe((respon:any) =>{
      this.totalPages = respon.data.totalPages * 10
      console.log(respon)
      this.rows = respon.data.data.content;
      this.rows.forEach(item => {
        item.organizationName = this.getOrganization(item);
        item.subscribeName = this.getSubscribe(item);
      })
    })
    this.formListCertificateRequest = this.fb.group({
      distinguishedName: ["", Validators.required],
      sizePage: [this.sizePage[0]],
      fromDate: [null],
      toDate: [null],
    });
  }

  getOrganization(item): any {
    let info = this._listCerReqService.readCertificate(item.certificateRequest);
    console.log(info)
    return info.find(obj => obj.name === 'organizationName').value;
  }
  getSubscribe(item): any {
    let info = this._listCerReqService.readCertificate(item.certificateRequest);
    return info.find(obj => obj.name == 'commonName').value;
  }

  //Chuyen trang
  changePage(e){
    console.log(typeof(e))
    this.page = e
    this._listCerReqService.getData(e-1,this.itemOnPage).subscribe((respon:any) =>{
      this.rows = respon.data.data;
    })
  }
  //Doi so luong dong tren 1 trang
  selectItem(e){
    console.log(e)
    const item = Number(e)
    this.itemOnPage = Number(e)
    this._listCerReqService.getData(this.page,item).subscribe((respon:any) =>{
      this.totalPages = respon.data.totalPages * 10
      this.rows = respon.data.data;
    })
  }

  onSubmit() {
    const jsDate = new Date(this.formListCertificateRequest.get("toDate").value.year, this.formListCertificateRequest.get("toDate").value.month - 1, this.formListCertificateRequest.get("toDate").value.day);
    console.log(jsDate);
    
    console.log(this.formListCertificateRequest.value);
    console.log(this.formListCertificateRequest.get("toDate").value);
  }

  /**
   * Range selection Date Picker
   * @param date
   */
   onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (this.fromDate && !this.toDate && date && date.after(this.fromDate)) {
      this.toDate = date;
    } else {
      this.toDate = null;
      this.fromDate = date;
    }
    this.formListCertificateRequest.get("fromDate").setValue(this.fromDate);
    this.formListCertificateRequest.get("toDate").setValue(this.toDate);

  }

  /**
   * Is Hovered
   * @param date
   */
  isHovered(date: NgbDate) {
    return (
      this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate)
    );
  }

  /**
   * Is Inside
   * @param date
   */
  isInside(date: NgbDate) {
    return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
  }

  /**
   *  Is Range
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

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}