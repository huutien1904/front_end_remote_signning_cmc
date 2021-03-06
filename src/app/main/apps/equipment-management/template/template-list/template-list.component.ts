import { PagedData } from './../../../../models/PagedData';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { CoreConfigService } from '@core/services/config.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TemplateService } from '../template.service';
import {
  ColumnMode,
  DatatableComponent,
  SelectionType,
} from '@swimlane/ngx-datatable';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Template } from 'app/main/models/Equipment';

@Component({
  selector: 'app-template-list',
  templateUrl: './template-list.component.html',
  styleUrls: ['./template-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class TemplateListComponent implements OnInit {
  // public set time datepicker
  minDate: Date;
  maxDate: Date;
  // public
  public contentHeader: object;
  public formTemplate: FormGroup;
  public moreOption = true;
  private _unsubscribeAll: Subject<any>;

  // data table
  @ViewChild(DatatableComponent) table: DatatableComponent;
  @ViewChild('tableRowDetails') tableRowDetails: any;
  public pagedData: any = new PagedData<any>()
  
  public rowsData = new Array<Template>();
  public isLoading: boolean = false;
  public ColumnMode = ColumnMode;
  public sizePage: number[] = [5, 10, 15, 20, 50, 100];
  public chkBoxSelected = [];
  public SelectionType = SelectionType;
  public totalItems: any = 0;
  public selected: any[] = [];
  constructor(
    private fb: FormBuilder,
    private dateAdapter: DateAdapter<any>,
    private _coreConfigService: CoreConfigService,
    private _templateService: TemplateService,
    private _toastrService: ToastrService,
    private _router: Router
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
      headerTitle: 'Template',
      actionButton: true,
      breadcrumb: {
        type: 'chevron',
        links: [
          {
            name: 'Danh s??ch',
            isLink: false,
          },
        ],
      },
    };

    this.formTemplate = this.fb.group({
      page: [null],
      size: [this.sizePage[1]],
      sort: [null],
      contains: [''],
      fromDate: [null],
      toDate: [null],
    });
    this.pagedData.totalItems = 7;
    this.setPage({ offset: 0, pageSize: this.formTemplate.get('size').value });
  }
  setPage(pageInfo) {
    this.isLoading = true;
    this.formTemplate.patchValue({ page: pageInfo.offset });
    console.log(pageInfo);
    console.log(this.formTemplate.value);
    this._templateService
      .getListTemplate(JSON.stringify(this.formTemplate.value))
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((pagedData: any) => {
        this.pagedData.totalItems = pagedData.data.length;
        console.log(this.pagedData.totalItems)
        this.pagedData = pagedData.data;
        this.pagedData.size = pagedData.data.length;
        // this.pagedData.totalPages = 0;
        // this.pagedData.currentPage = 1;

        this.totalItems = pagedData.data.length;

        this.rowsData = pagedData.data.map((item: any, index) => ({
          ...item,
        }));
        console.log(this.rowsData);
        console.log(this.pagedData);
        this.isLoading = false;
      });
  }
  onActivate(event) {
    // if (
    //   event.type === 'click' &&
    //   event.column.name != 'H??nh ?????ng' &&
    //   event.column.name != 'checkbox'
    // ) {
    //   this._router.navigate([
    //     '/apps/equipment-management/hsm/hsm-view/',
    //     event.row.hsmId,
    //   ]);
    // }
  }
  onSelect(event) {
    // console.log(event.selected);
    // this.selected = event.selected;
  }
  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
