import { Component, OnInit, ViewEncapsulation, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { CertificateRequestListService } from "./certificate-request-list.service";
import { Subject } from 'rxjs';
import { DateAdapter } from "@angular/material/core";
import { CoreConfigService } from "@core/services/config.service";
import { takeUntil } from "rxjs/operators";
import {
  ColumnMode,
  DatatableComponent,
  SelectionType,
} from "@swimlane/ngx-datatable";
import { PagedData } from "app/main/models/PagedData"
import { CertificateRequest } from "app/main/models/CertificateRequest";
import { DomSanitizer } from "@angular/platform-browser";
@Component({
  selector: "app-certificate-request-list",
  templateUrl: "./certificate-request-list.component.html",
  styleUrls: ["./certificate-request-list.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class CertificateRequestListComponent implements OnInit {
  //Public Properties
  @ViewChild(DatatableComponent) table: DatatableComponent;
  @ViewChild("tableRowDetails") tableRowDetails: any;
  minDate: Date;
  maxDate: Date;
  public rowsData = new Array<CertificateRequest>();
  public pagedData = new PagedData<CertificateRequest>();
  public moreOption = true;
  public sizePage: number[] = [5, 10, 15, 20, 50, 100];
  public formListCertificateRequest: FormGroup;
  private _unsubscribeAll: Subject<any>;
  public chkBoxSelected = [];
  public selected = [];
  public SelectionType = SelectionType;
  public isLoading: boolean = false;
  public ColumnMode = ColumnMode;
  public fileUrl;
  public fileName;

  constructor(
    private fb: FormBuilder,
    private _listCerReqService: CertificateRequestListService,
    private _coreConfigService: CoreConfigService,
    private dateAdapter: DateAdapter<any>,
    private sanitizer: DomSanitizer
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
    this.formListCertificateRequest = this.fb.group({
      inputSearch: ["", Validators.required],
      sizePage: [this.sizePage[0]],
      fromDate: [null],
      toDate: [null],
    });
    this.pagedData.size = this.sizePage[0];
    this.pagedData.currentPage = 0;
    this.setPage({ offset: 0, pageSize: this.pagedData.size })
  }

  getOrganization(item): any {
    let info = this._listCerReqService.readCertificate(item.CertificateRequest);
    return info.find(obj => obj.name === 'organizationName').value;
  }
  getSubscribe(item): any {
    let info = this._listCerReqService.readCertificate(item.CertificateRequest);
    return info.find(obj => obj.name == 'commonName').value;
  }

  changePage() {
    this.pagedData.size = this.formListCertificateRequest.get("sizePage").value;
    this.setPage({ offset: 0, pageSize: this.pagedData.size });
  }
  
  setPage(pageInfo) {
    this.isLoading=true;
    this.pagedData.currentPage = pageInfo.offset;
    this.pagedData.size = pageInfo.pageSize;
    this._listCerReqService
      .getData(this.pagedData)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((pagedData) => {
        this.pagedData = pagedData.data;
        this.rowsData = pagedData.data.data;
        this.rowsData = pagedData.data.data.map(item => ({
          ...item,
          organizationName: this.getOrganization(item),
          subscribeName: this.getSubscribe(item)
        }))
        console.log(this.rowsData)
        this.isLoading=false;
      });
  }

  downloadSidebar(row){
    const data = row.CertificateRequest;
    const blob = new Blob([data], { type: 'application/octet-stream' });
    this.fileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      window.URL.createObjectURL(blob)
    );
    this.fileName = row.CertificateRequestId + '.csr';
  }

  /**
   * Custom Checkbox On Select
   *
   * @param { selected }
  */
  customCheckboxOnSelect({ selected }) {
    this.chkBoxSelected.splice(0, this.chkBoxSelected.length);
    this.chkBoxSelected.push(...selected);
  }
  /**
   * For ref only, log selected values
   *
   * @param selected
   */
  onSelect({ selected }) {
    console.log("Select Event", selected, this.selected);
    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
  }

  onSubmit() {
    console.log(this.formListCertificateRequest);
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}