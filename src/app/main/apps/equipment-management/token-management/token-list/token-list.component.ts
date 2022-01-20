import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { Router } from '@angular/router';
import { CoreConfigService } from '@core/services/config.service';
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import {
  ColumnMode,
  DatatableComponent,
  SelectionType,
} from '@swimlane/ngx-datatable';
import { Token } from 'app/main/models/Equipment';
import { PagedData } from 'app/main/models/PagedData';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TokenService } from '../token.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-token-list',
  templateUrl: './token-list.component.html',
  styleUrls: ['./token-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class TokenListComponent implements OnInit {
  minDate: Date;
  maxDate: Date;
  public moreOption = true;
  public formListToken: FormGroup;
  private _unsubscribeAll: Subject<any>;
  public contentHeader: object;
  item
  //page setup
  @ViewChild(DatatableComponent) table: DatatableComponent;
  @ViewChild('tableRowDetails') tableRowDetails: any;
  public rowsData = new Array<Token>();
  public pagedData = new PagedData<Token>();
  public isLoading: boolean = false;
  public ColumnMode = ColumnMode;
  public page: number = 0;
  public totalPages: number = 0;
  public sizePage: number[] = [5, 10, 15, 20, 50, 100];
  public SelectionType = SelectionType;
  public totalItems: any = 0;
  public selected: any[] = [];

  constructor(
    private fb: FormBuilder,
    private _tokenService: TokenService,
    private _coreConfigService: CoreConfigService,
    private dateAdapter: DateAdapter<any>,
    private _toastrService: ToastrService,
    private _router: Router,
    private modal: NgbModal,

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
      headerTitle: 'Slot',
      actionButton: true,
      breadcrumb: {
        type: 'chevron',
        links: [
          {
            name: 'Danh sách Slot',
            isLink: false,
          },
        ],
      },
    };
    this.formListToken = this.fb.group({
      page: [null],
      size: [this.sizePage[3]],
      sort: [null],
      contains: [''],
      fromDate: [null],
      toDate: [null],
    });
    this.setPage({ offset: 0, pageSize: this.formListToken.get('size').value });
  }

  setPage(pageInfo) {
    console.log(this.formListToken.value);
    this.isLoading = true;
    this.formListToken.patchValue({ page: pageInfo.offset });

    this._tokenService
      .getListToken(JSON.stringify(this.formListToken.value))
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((pagedData) => {
        console.log(pagedData.data);
        this.totalItems = pagedData.data.totalItems;
        this.pagedData = pagedData.data;
        this.rowsData = pagedData.data.data;
        this.isLoading = false;
      });
  }
  onActivate(event) {
    if (
      event.type === 'click' &&
      event.column.name != 'Hành động' &&
      event.column.name != 'checkbox'
    ) {
      console.log(event.row)
      this._router.navigate([
        '/apps/equipment-management/token/token-view/',
        event.row.tokenId,
      ]);
    }
  }
  onSelect(event) {
    console.log('test');
    console.log(event.selected);
    this.selected = event.selected;
  }
  selectFn() {
    console.log('fn');
  }
  toggleSidebar(modalTokenPassWordForm, item) {
    this.item = item;
    console.log(item);
    console.log(modalTokenPassWordForm)
    this.modal.open(modalTokenPassWordForm, {size: 'lg'})
  }
  removeProfile(hsmId) {
    this._tokenService.deleteTokenId(hsmId).subscribe((res) => {
      // this.updateTableOnDelete();
      this._toastrService.success(
        'Xóa kết nối Token thành công ',
        'Thành công',
        { toastClass: 'toast ngx-toastr', closeButton: true }
      );
      this.setPage({
        offset: 0,
        pageSize: this.formListToken.controls.size,
      });
    });
  }
  deleteToken() {
    console.log(this.selected);
    Swal.fire({
      title: 'Bạn có chắc muốn xóa?',
      text: 'Bạn sẽ không thể hoàn tác điều này!',
      icon: 'warning',
      showCancelButton: true,
      preConfirm: async () => {
        console.log(this.selected.length);
        for (let i = 0; i < this.selected.length; i++) {
          console.log(this.selected[i].tokenId);
          this._tokenService
            .deleteTokenId(this.selected[i].tokenId)
            .subscribe((res) => {
              console.log(res);
              this.setPage({
                offset: 0,
                pageSize: this.formListToken.controls.size,
              });
            });
          // .catch(function (error) {
          //   //Swal.showValidationMessage('Mã lỗi:  ' + error + '');
          // });
        }
      },
      cancelButtonColor: '#E42728',
      cancelButtonText: 'Thoát',
      confirmButtonText: 'Đúng, tôi muốn xóa!',
      customClass: {
        confirmButton: 'btn btn-primary',
        cancelButton: 'btn btn-danger ml-1',
      },
    }).then(function (result) {
      console.log(result);
      console.log(result.value);
      if (result.isDismissed == false) {
        Swal.fire({
          icon: 'success',
          title: 'Xóa thành công!',
          text: 'Thông tin tài khoản đã được cập nhật.',
          customClass: {
            confirmButton: 'btn btn-success',
          },
        });
      }
    });
  }
  onSubmit() {
    console.log(this.formListToken);
  }
  exportCSV() {
    console.log(this.formListToken.value);
    // this._tokenService
    //   .getListToken(JSON.stringify(this.formListToken.value))
    //   .pipe(takeUntil(this._unsubscribeAll))
    //   .subscribe((pagedData)=>{
    //     console.log(pagedData);
    //   })
    this._tokenService.getListToken(JSON.stringify);
    this._tokenService
      .getListToken(JSON.stringify(this.formListToken.value))
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((pagedData) => {
        this.totalItems = pagedData.data.totalItems;
        console.log(pagedData);
        console.log(pagedData.data.data);
        if (!pagedData.data.data || !pagedData.data.data.length) {
          return;
        }
        const separator = ',';
        const keys = Object.keys(pagedData.data.data[0]);
        const csvData =
          keys.join(separator) +
          '\n' +
          pagedData.data.data
            .map((row) => {
              return keys
                .map((k) => {
                  if (k !== 'createdAt') {

                    console.log("Test")
                  }
                  let cell =
                    row[k] === null || row[k] === undefined ? '' : row[k];
                  cell =
                    cell instanceof Date
                      ? cell.toLocaleString()
                      : cell.toString().replace(/"/g, '""');
                  if (cell.search(/("|,|\n)/g) >= 0) {
                    cell = `"${cell}"`;
                  }
                  return cell;
                })
                .join(separator);
            })
            .join('\n');

        const blob = new Blob(['\ufeff' + csvData], {
          type: 'text/csv;charset=utf-8;',
        });
        const link = document.createElement('a');
        if (link.download !== undefined) {
          // Browsers that support HTML5 download attribute
          const url = URL.createObjectURL(blob);
          link.setAttribute('href', url);
          link.setAttribute('download', 'Danh Sách TOKEN');
          link.style.visibility = 'hidden';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
