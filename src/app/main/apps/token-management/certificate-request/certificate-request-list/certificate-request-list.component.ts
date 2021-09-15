import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { CertificateRequestListService } from "./certificate-request-list.service";
import { Subject } from 'rxjs';
import { DateAdapter } from "@angular/material/core";
import { CoreConfigService } from "@core/services/config.service";
import { takeUntil } from "rxjs/operators";
@Component({
  selector: "app-certificate-request-list",
  templateUrl: "./certificate-request-list.component.html",
  styleUrls: ["./certificate-request-list.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class CertificateRequestListComponent implements OnInit {
  //Public Properties
  minDate: Date;
  maxDate: Date;
  public rows: any[] = [];
  public moreOption = true;
  public page: number = 0;
  public pageAdvancedEllipses = 1;
  public totalPages: number;
  public sizePage: number[] = [5, 10, 15, 20];
  public formListCertificateRequest: FormGroup;
  private _unsubscribeAll: Subject<any>;

  constructor(
    private fb: FormBuilder,
    private _listCerReqService: CertificateRequestListService,
    private _coreConfigService: CoreConfigService,
    private dateAdapter: DateAdapter<any>
  ) {
    this._unsubscribeAll = new Subject();
    const currentYear = new Date().getFullYear();
    this.minDate = new Date(currentYear - 4, 0, 1);
    this.maxDate = new Date(currentYear + 2, 11, 31);
    this._coreConfigService.config
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((config) => {
        this.dateAdapter.setLocale(config.app.appLanguage);
      });
  }

  ngOnInit(): void {
    this._listCerReqService.getData(this.page, this.sizePage[1]).subscribe((respon:any) =>{
      this.totalPages = respon.data.totalPages * 10
      this.rows = respon.data.data;
      console.log(this.rows)
      this.rows.forEach(item => {
        item.organizationName = this.getOrganization(item);
        item.subscribeName = this.getSubscribe(item);
      })
    })
    this.formListCertificateRequest = this.fb.group({
      inputSearch: ["", Validators.required],
      sizePage: [this.sizePage[1]],
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

  changePage(e) {
    this.page = e;
    this._listCerReqService
      .getData(e - 1, this.formListCertificateRequest.controls['sizePage'].value)
      .subscribe((res: any) => {
        this.rows = res.data.data;
        this.rows.forEach(item => {
          item.organizationName = this.getOrganization(item);
          item.subscribeName = this.getSubscribe(item);
        })
      });
  }

  selectItem() {
    this._listCerReqService
      .getData(this.page, this.formListCertificateRequest.controls['sizePage'].value)
      .subscribe((res: any) => {
        this.totalPages = res.data.totalPages * this.formListCertificateRequest.controls['sizePage'].value;
        this.rows = res.data.data;
        this.rows.forEach(item => {
          item.organizationName = this.getOrganization(item);
          item.subscribeName = this.getSubscribe(item);
        })
      });
  }

  onSubmit() {
    console.log(this.formListCertificateRequest);
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}