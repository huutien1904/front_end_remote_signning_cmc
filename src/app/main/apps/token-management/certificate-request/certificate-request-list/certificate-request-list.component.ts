import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CertificateRequestListService } from './certificate-request-list.service';
import { Subject } from 'rxjs';
import { DateAdapter } from '@angular/material/core';
import { CoreConfigService } from '@core/services/config.service';
import { takeUntil } from 'rxjs/operators';
import {
  ColumnMode,
  DatatableComponent,
  SelectionType,
} from '@swimlane/ngx-datatable';
import { PagedData } from 'app/main/models/PagedData';
import { CertificateRequest } from 'app/main/models/CertificateRequest';
import { DomSanitizer } from '@angular/platform-browser';
@Component({
  selector: 'app-certificate-request-list',
  templateUrl: './certificate-request-list.component.html',
  styleUrls: ['./certificate-request-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CertificateRequestListComponent implements OnInit {
  //Public Properties
  @ViewChild(DatatableComponent) table: DatatableComponent;
  @ViewChild('tableRowDetails') tableRowDetails: any;
  minDate: Date;
  maxDate: Date;
  public rowsData = new Array<CertificateRequest>();
  public pagedData = new PagedData<CertificateRequest>();
  public totalItems: any = 0;
  public moreOption = true;
  public sizePage: number[] = [5, 10, 15, 20, 50, 100];
  public formListCertificateRequest: FormGroup;
  private _unsubscribeAll: Subject<any>;
  public chkBoxSelected = [];
  public selected = [];
  public SelectionType = SelectionType;
  public isLoading: boolean = false;
  public ColumnMode = ColumnMode;
  public contentHeader: object;

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
      contains: [null],
      fromDate: [null],
      sort: [null],
      toDate: [null],
      page: [null],
      size: [this.sizePage[3]],
    });
    this.setPage({
      offset: 0,
      pageSize: this.formListCertificateRequest.get('size').value,
    });
    this.contentHeader = {
      headerTitle: 'Yêu cầu chứng thực',
      actionButton: true,
      breadcrumb: {
        type: 'chevron',
        links: [
          {
            name: 'Danh sách',
            isLink: false,
          },
        ],
      },
    };

    this.formListCertificateRequest = this.fb.group({

      page: [null],
      size: [this.sizePage[3]],
      sort : [null],
      contains: [null],
      fromDate: [null],
      toDate: [null],
    });
    
    this.setPage({ offset: 0, pageSize: this.formListCertificateRequest.get('size').value });
    
  }

  getOrganization(item): any {
    let info = this._listCerReqService.readCertificate(item.certificateRequestContent);
    let rs = info.find((obj) => obj.name === 'organizationalUnitName');
    if (rs == undefined) return;
    return rs.value;
  }
  getSubscribe(item): any {
    let info = this._listCerReqService.readCertificate(item.certificateRequestContent);
    return info.find((obj) => obj.name === 'commonName').value;
  }



  setPage(pageInfo) {
    this.isLoading = true;
    this.formListCertificateRequest.patchValue({ page: pageInfo.offset });
    this._listCerReqService
      .getListCertificateRequests(JSON.stringify(this.formListCertificateRequest.value))
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((pagedData) => {
        this.totalItems = pagedData.data.totalItems;
        this.pagedData = pagedData.data;
        this.rowsData = pagedData.data.data;
        this.rowsData = pagedData.data.data.map((item) => ({
          ...item,
          organizationName: this.getOrganization(item),
          subscribeName: this.getSubscribe(item),
        }));
        this.isLoading = false;
      });
  }

  downloadSidebar(row) {
    const data = row.certificateRequest;
    const blob = new Blob([data], { type: 'application/octet-stream' });
    row.fileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      window.URL.createObjectURL(blob)
    );
    row.fileName = row.keypairAlias + 'requestId' + row.certificateRequestId + '.csr';
    console.log(row);
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
    console.log('Select Event', selected, this.selected);
    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
  }



  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
