import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { Router } from '@angular/router';
import { CoreConfigService } from '@core/services/config.service';
import {
  ColumnMode,
  DatatableComponent,
  SelectionType,
} from '@swimlane/ngx-datatable';
import { Hsm } from 'app/main/models/Equipment';
import { PagedData } from 'app/main/models/PagedData';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { HsmService } from '../hsm.service';
import Swal from 'sweetalert2';
import { ItemsList } from '@ng-select/ng-select/lib/items-list';

@Component({
  selector: 'app-hsm-list',
  templateUrl: './hsm-list.component.html',
  styleUrls: ['./hsm-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class HsmListComponent implements OnInit {
  minDate: Date;
  maxDate: Date;
  public moreOption = true;
  public formListHsm: FormGroup;
  public formListHsm2: FormGroup;

  private _unsubscribeAll: Subject<any>;
  public contentHeader: object;

  //page setup
  @ViewChild(DatatableComponent) table: DatatableComponent;
  @ViewChild('tableRowDetails') tableRowDetails: any;
  public pagedData:any = new PagedData<Hsm>();
  public rowsData = new Array<Hsm>();

  public isLoading: boolean = false;
  public ColumnMode = ColumnMode;
  // public page: number = 0;
  // public totalPages: number = 0;
  public sizePage: number[] = [5, 10, 15, 20, 50, 100];
  public chkBoxSelected = [];
  public SelectionType = SelectionType;
  public totalItems: any = 0;
  public selected: any[] = [];
  constructor(
    private fb: FormBuilder,
    private _hsmService: HsmService,
    private _coreConfigService: CoreConfigService,
    private dateAdapter: DateAdapter<any>,
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
      headerTitle: 'Kết nối HSM',
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

    this.formListHsm = this.fb.group({
      page: [null],
      size: [this.sizePage[1]],
      sort: [null],
      contains: [''],
      fromDate: [null],
      toDate: [null],
    });
    this.formListHsm2 = this.fb.group({
      page: 0,
      size: 1000,
      sort: [null],
      contains: [''],
      fromDate: [null],
      toDate: [null],
    });
    this.setPage({ offset: 0, pageSize: this.formListHsm.get('size').value });
  }

  setPage(pageInfo) {
    this.isLoading = true;
    this.formListHsm.patchValue({ page: pageInfo.offset });
    console.log(pageInfo);
    console.log(this.formListHsm.value);
    this._hsmService
      .getListHsm(JSON.stringify(this.formListHsm.value))
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((pagedData) => {
        this.totalItems = pagedData.data.totalItems;
        console.log(pagedData);
        console.log(pagedData.data.totalItems);
        this.pagedData = pagedData.data;
        this.rowsData = pagedData.data.data.map((item:any,index) => ({
          ...item,
          tokenName:  item.tokens.length > 0 ? item.tokens[0].tokenName : "Chưa khởi tạo"
        }));
        console.log(this.rowsData);
        this.isLoading = false;
      });

      console.log("tien123hsm",this.pagedData)
  }
  onActivate(event) {
    if (
      event.type === 'click' &&
      event.column.name != 'Hành động' &&
      event.column.name != 'checkbox'
    ) {
      this._router.navigate([
        '/apps/equipment-management/hsm/hsm-view/',
        event.row.hsmId,
      ]);
    }
  }
  onSelect(event) {
    console.log(event.selected);
    this.selected = event.selected;
  }
  deleteHSM() {
    Swal.fire({
      title: 'Bạn có chắc muốn xóa?',
      text: 'Bạn sẽ không thể hoàn tác điều này!',
      icon: 'warning',
      showCancelButton: true,
      preConfirm: async () => {
        console.log(this.selected.length);
        for (let i = 0; i < this.selected.length; i++) {
          console.log(this.selected[i].hsmId);
          this._hsmService
            .deleteHsmId(this.selected[i].hsmId)
            .subscribe((res) => {
              console.log(res);
              this.setPage({
                offset: 0,
                pageSize: this.formListHsm.controls.size,
              });
            });
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
  connectHsm(row:Hsm){
    Swal.fire({
      title: 'Bạn có chắc muốn thay đổi trạng thái?',
      text: 'Bạn sẽ không thể hoàn tác điều này!',
      icon: 'warning',
      showCancelButton: true,
      preConfirm: async () => {
        return await this._hsmService
        .connectHsm(row.hsmId)
        .pipe(takeUntil(this._unsubscribeAll))
        .toPromise()
        .then((res)=>{
          if(res.result == false){
            throw new Error(res.message);
          }
          row.connect = res.data.connect;
          return res;
        })
        .catch((error)=>{
          Swal.showValidationMessage('Mã lỗi: ' + error);
        })
        ;
      },
      cancelButtonColor: '#E42728',
      cancelButtonText: 'Thoát',
      confirmButtonText: 'Đúng, tôi thay đổi trạng thái!',
      customClass: {
        confirmButton: 'btn btn-primary',
        cancelButton: 'btn btn-danger ml-1',
      },
      allowOutsideClick: () => {
        return !Swal.isLoading();
      },
    }).then(function (result) {
      if (result.value) {
        Swal.fire({
          icon: 'success',
          title: 'Thành công!',
          text: 'Trạng thái Hsm đã được cập nhật.',
          customClass: {
            confirmButton: 'btn btn-success',
          },
        });
      }
    });
  }
  testSyn() {
    for (let i = 0; i < this.selected.length; i++) {
      console.log(this.selected[i].hsmId);
      this._hsmService.deleteHsmId(this.selected[i].hsmId).subscribe((res) => {
        console.log(res);
        this.setPage({
          offset: 0,
          pageSize: this.formListHsm.controls.size,
        });
      });
      // .catch(function (error) {
      //   //Swal.showValidationMessage('Mã lỗi:  ' + error + '');
      // });
    }
  }
  // customCheckboxOnSelect({ selected }) {
  //   console.log({ selected });
  // }
  onCheckboxChangeFn(event, { selected }) {
    console.log({ selected });
    console.log(event);
  }
  removeHsm(row) {
    Swal.fire({
      title: 'Bạn có chắc muốn xóa kết nối?',
      text: 'Bạn sẽ không thể hoàn tác điều này!',
      icon: 'warning',
      showCancelButton: true,
      preConfirm: async () => {
        return await this._hsmService.deleteHsmId(row.hsmId)
        .pipe(takeUntil(this._unsubscribeAll))
        .toPromise()
        .then((res)=>{
          if(res.result == false){
            throw new Error(res.message);
          }
          this.rowsData = this.arrayRemove(this.rowsData, row.hsmId)
          if(this.rowsData.length==0){
            this.setPage({ offset: 0, pageSize: this.formListHsm.get('size').value });
          }
          return res;
        }).catch((error) => {
          Swal.showValidationMessage('Mã lỗi: ' + error);
        });
      },
      cancelButtonColor: '#E42728',
      cancelButtonText: 'Thoát',
      confirmButtonText: 'Đúng, tôi muốn xóa!',
      customClass: {
        confirmButton: 'btn btn-primary',
        cancelButton: 'btn btn-danger ml-1',
      },
      allowOutsideClick: () => {
        return !Swal.isLoading();
      },
    }).then(function (result) {
      if (result.value) {
        Swal.fire({
          icon: 'success',
          title: 'Thành công!',
          text: 'Hsm đã được xoá thành công.',
          customClass: {
            confirmButton: 'btn btn-success',
          },
        });
      }
    });
  };

  exportCSV() {
    console.log(this.formListHsm2.value);
    this._hsmService
      .getListHsm(JSON.stringify(this.formListHsm2.value))
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

        const blob = new Blob(['\ufeff'+csvData], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        if (link.download !== undefined) {
          // Browsers that support HTML5 download attribute
          const url = URL.createObjectURL(blob);
          link.setAttribute('href', url);
          link.setAttribute('download', 'Danh Sách HSM');
          link.style.visibility = 'hidden';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      });
  }
  arrayRemove(array, rowId) {
    return array.filter(function(element){
        return element.hsmId != rowId;
    });
  }
  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
