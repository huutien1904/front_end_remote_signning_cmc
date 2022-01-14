import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { CoreConfigService } from '@core/services/config.service';
import {
  NgbDateParserFormatter
} from '@ng-bootstrap/ng-bootstrap';
import {
  ColumnMode, DatatableComponent, SelectionType
} from '@swimlane/ngx-datatable';
import { PagedData } from 'app/main/models/PagedData';
import { SubscriberCertificate } from 'app/main/models/SubscriberCertificate';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SubscriberCertificateListService } from './subscriber-certificate-list.service';
@Component({
  selector: 'app-subscriber-certificate-list',
  templateUrl: './subscriber-certificate-list.component.html',
  styleUrls: ['./subscriber-certificate-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SubscriberCertificateListComponent implements OnInit {
  minDate: Date;
  maxDate: Date;
  private _unsubscribeAll: Subject<any>;
  public SelectionType = SelectionType;
  public chkBoxSelected = [];
  public selected = [];

  //Public Properties
  formListSubscriberCertificate: FormGroup;
  public sizePage: number[] = [5, 10, 15, 20, 50, 100];
  public pageAdvancedEllipses = 1;
  public moreOption = true;
  public contentHeader: object;
  //page setup
  @ViewChild(DatatableComponent) table: DatatableComponent;
  @ViewChild('tableRowDetails') tableRowDetails: any;
  public pagedData = new PagedData<SubscriberCertificate>();
  public rowsData = new Array<SubscriberCertificate>();
  public isLoading: boolean = false;
  //Table of personal data
  public totalItems: any = 0;
  public ColumnMode = ColumnMode;
  constructor(
    private _coreConfigService: CoreConfigService,
    private fb: FormBuilder,
    public formatter: NgbDateParserFormatter,
    public _subscriberCertificateService: SubscriberCertificateListService,
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
    this.contentHeader = {
      headerTitle: 'Chứng thư số',
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

    this.formListSubscriberCertificate = this.fb.group({
      contains: [null],
      fromDate: [null],
      sort: [null],
      toDate: [null],
      page: [null],
      size: [this.sizePage[3]],
    });

    this.setPage({
      offset: 0,
      pageSize: this.formListSubscriberCertificate.get('size').value,
    });
  }

  //Set Table View
  setPage(pageInfo) {
    console.log(pageInfo);
    this.isLoading = true;
    this.formListSubscriberCertificate.patchValue({ page: pageInfo.offset });
    this._subscriberCertificateService
      .getListSubscriberCertificates(
        JSON.stringify(this.formListSubscriberCertificate.value)
      )
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((pagedData) => {
        this.totalItems = pagedData.data.totalItems;
        this.pagedData = pagedData.data;
        this.rowsData = pagedData.data.data.map((item) => ({
          ...item,
          // organizationName: this.getOrganization(item),
          // subscribeName: this.getSubscriber(item),
        }));
        // this.rowsData = pagedData.data.data;
        console.log(this.rowsData)
        this.isLoading = false;
      });
  }

  getOrganization(item): any {
    let info = this._subscriberCertificateService.readCertificate(
      item.certificate
    );
    let rs = info.find((obj) => obj.name === 'organizationalUnitName');
    if (rs == undefined) return;
    return rs.value;
  }
  getSubscriber(item): any {
    let info = this._subscriberCertificateService.readCertificate(
      item.certificate
    );
    console.log(info);
    return info.find((obj) => obj.name === 'commonName').value;
  }
  changePage(e) {}
  onSubmit() {
    console.log(this.formListSubscriberCertificate.value);
    console.log(this.formListSubscriberCertificate.get('toDate').value);
  }
  downloadOne(row){
    console.log(row)
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
}
