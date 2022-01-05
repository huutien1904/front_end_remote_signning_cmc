import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { CoreConfigService } from '@core/services/config.service';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
import { Token } from 'app/main/models/Equipment';
import { PagedData } from 'app/main/models/PagedData';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TokenService } from '../token.service';

@Component({
  selector: 'app-token-list',
  templateUrl: './token-list.component.html',
  styleUrls: ['./token-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TokenListComponent implements OnInit {

  minDate: Date;
  maxDate: Date;
  public moreOption = true;
  public formListToken: FormGroup;
  private _unsubscribeAll: Subject<any>;
  public contentHeader: object;

  //page setup
  @ViewChild(DatatableComponent) table: DatatableComponent;
  @ViewChild("tableRowDetails") tableRowDetails: any;
  public rowsData = new Array<Token>();
  public pagedData = new PagedData<Token>();
  public isLoading: boolean = false;
  public ColumnMode = ColumnMode;
  public page: number = 0;
  public totalPages: number = 0;
  public sizePage: number[] = [5, 10, 15, 20, 50, 100];
  public SelectionType = SelectionType;
  public totalItems: any = 0;

  constructor(
    private fb: FormBuilder,
    private _tokenService: TokenService,
    private _coreConfigService: CoreConfigService,
    private dateAdapter: DateAdapter<any>,
    private _toastrService: ToastrService,
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
      headerTitle: "Token",
      actionButton: true,
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
    this.formListToken = this.fb.group({
      page : [null],
      size : [this.sizePage[3]],
      sort: [null],
      contains:[""],
      fromDate: [null],
      toDate: [null]
    });
    this.setPage({ offset: 0, pageSize: this.formListToken.get("size").value });
  }


  setPage(pageInfo) {
    
    this.isLoading = true;
    this.formListToken.patchValue({"page":pageInfo.offset});

    this._tokenService
      .getListToken(JSON.stringify(this.formListToken.value))
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((pagedData) => {
        console.log(pagedData.data )
        this.totalItems = pagedData.data.totalItems;
        this.pagedData = pagedData.data;
        this.rowsData= pagedData.data.data;
        this.isLoading = false;
      });
  }

  removeProfile(hsmId){
    this._tokenService
    .deleteTokenId(hsmId)
    .subscribe((res) =>{
        // this.updateTableOnDelete();
        this._toastrService.success(
          "Xóa kết nối Token thành công ",   
          "Thành công",
          { toastClass: "toast ngx-toastr", closeButton: true }
        );
        this.setPage({
          offset: 0,
          pageSize: this.formListToken.controls.size
        })
    })
  }

  onSubmit() {
    console.log(this.formListToken);
  }


  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
