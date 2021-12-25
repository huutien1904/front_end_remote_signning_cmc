import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { Router } from '@angular/router';
import { CoreConfigService } from '@core/services/config.service';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
import { Hsm } from 'app/main/models/Equipment';
import { PagedData } from 'app/main/models/PagedData';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { HsmService } from '../hsm.service';

@Component({
  selector: 'app-hsm-list',
  templateUrl: './hsm-list.component.html',
  styleUrls: ['./hsm-list.component.scss'],
  encapsulation: ViewEncapsulation.None

})
export class HsmListComponent implements OnInit {

  minDate: Date;
  maxDate: Date;
  public moreOption = true;
  public formListHsm: FormGroup
  private _unsubscribeAll: Subject<any>;
  public contentHeader: object;


  //page setup
  @ViewChild(DatatableComponent) table: DatatableComponent;
  @ViewChild("tableRowDetails") tableRowDetails: any;
  public pagedData = new PagedData<Hsm>();
  public rowsData = new Array<Hsm>();

  public isLoading: boolean = false;
  public ColumnMode = ColumnMode;
  public page: number = 0;
  public totalPages: number = 0;
  public sizePage: number[] = [5, 10, 15, 20, 50, 100];
  public chkBoxSelected = [];
  public selected = [];
  public SelectionType = SelectionType;
  public totalItems: any = 0;

  constructor(
    private fb: FormBuilder,
    private _hsmService: HsmService,
    private _coreConfigService: CoreConfigService,
    private dateAdapter: DateAdapter<any>,
    private router: Router,
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
      headerTitle: "Kết nối HSM",
      // actionButton: true,
      breadcrumb: {
        type: "chevron",
        links: [
          {
            name: "Danh sách",
            isLink: false,
          }
        ],
      },
    };

    this.formListHsm = this.fb.group({
      page : [null],
      size : [this.sizePage[0]],
      sort: [null],
      contains:[""],
      fromDate: [null],
      toDate: [null]
    });
    this.setPage({ offset: 0, pageSize: this.formListHsm.get("size").value });

  }

  setPage(pageInfo) {
    
    this.isLoading = true;
    this.formListHsm.patchValue({"page":pageInfo.offset});
    console.log(pageInfo);
    console.log(this.formListHsm.value);
    
    this._hsmService
      .getListHsm(JSON.stringify(this.formListHsm.value))
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((pagedData) => {
        this.totalItems = pagedData.data.totalItems;
        console.log(pagedData);
        
        this.pagedData = pagedData.data;
        console.log(this.pagedData);
        
        this.rowsData= pagedData.data.data;
        this.isLoading = false;
      });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

}
