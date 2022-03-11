import {
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { CoreConfigService } from '@core/services/config.service';
import {
  ColumnMode,
  DatatableComponent,
  SelectionType,
} from '@swimlane/ngx-datatable';
import { PagedData } from 'app/main/models/PagedData';
import { EntityProfile } from 'app/main/models/EntityProfile';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { EntityProfileService } from '../entity-profile.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profile-list',
  templateUrl: './entity-profile-list.component.html',
  styleUrls: ['./entity-profile-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ProfileListComponent implements OnInit, OnDestroy {
  minDate: Date;
  maxDate: Date;
  private _unsubscribeAll: Subject<any>;
  public SelectionType = SelectionType;
  public rowIndex: any;

  public formListProfile: FormGroup;
  public contentHeader: object;
  public sizePage: number[] = [5, 10, 15, 20, 50, 100];
  public moreOption = true;
  public typeProfile = ['Cá nhân','Tổ chức','Thiết bị/dịch vụ'];

  //page setup
  @ViewChild(DatatableComponent) table: DatatableComponent;
  @ViewChild('tableRowDetails') tableRowDetails: any;
  public pagedData = new PagedData<EntityProfile>();
  public rowsData = new Array<EntityProfile>();
  public isLoading: boolean = false;
  //Table of personal data
  public totalItems: any = 0;
  public selected = [];
  public ColumnMode = ColumnMode;
  public chkBoxSelected = [];
  public dataExport :any
  constructor(
    private _coreConfigService: CoreConfigService,
    private fb: FormBuilder,
    private _entityProfileService: EntityProfileService,
    private dateAdapter: DateAdapter<any>,
    private _router: Router,
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
    this.formListProfile = this.fb.group({
      contains: [null],
      fromDate: [null],
      sort: [null],
      toDate: [null],
      page: [null],
      size: [this.sizePage[3]],
    });
    // content header profile
    this.contentHeader = {
      headerTitle: 'EntityProfile',
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
    // end content header profile

    this.setPage({
      offset: 0,
      pageSize: this.formListProfile.get('size').value,
    });
  }
  // get seleted item
  onSelect({ selected }) {
    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
    console.log("Select Event", selected, this.selected);

  }
  customCheckboxOnSelect({ selected }) {
    this.chkBoxSelected.splice(0, this.chkBoxSelected.length);
    this.chkBoxSelected.push(...selected);
  }
  //Set Table View
  setPage(pageInfo) {
    console.log(pageInfo);
    this.isLoading = true;
    this.formListProfile.patchValue({ page: pageInfo.offset });
    this._entityProfileService
      .getListProfiles(JSON.stringify(this.formListProfile.value))
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((pagedData) => {
        this.totalItems = pagedData.data.totalItems;
        this.pagedData = pagedData.data;
        this.rowsData = pagedData.data.data.map((profileList) => ({
          ...profileList,
          subjectDnAttribute: profileList.distinguishedName.map((d) => d.name),
          subjectDnAlternative: profileList.alternativeName.map((d) => d.name),
          typeProfile: 'Cá nhân',
        }));
        console.log(this.pagedData);
        console.log(this.rowsData);
        this.isLoading = false;
      });
  }
  // set active row
  onActivate(event) {
    if(event.event.type === 'click' && event.column.name!="Hành động" && event.column.name!="checkbox") {
      this._router.navigate(['/apps/ip/profiles/profile-edit', event.row.endEntityProfileId]);
    }
  }
  // remove profile item
  removeProfile(entityId){
    console.log(entityId);
    this._entityProfileService
    .deleteProfileId(entityId)
    .subscribe((res) =>{
        // this.updateTableOnDelete();
        this._toastrService.success(
          "Xóa Entity Profile thành công ",   
          "Thành công",
          { toastClass: "toast ngx-toastr", closeButton: true }
        );
        this.setPage({
          offset: 0,
          pageSize: this.formListProfile.controls.size
        })
    })
  }
  deleteProfile(entityId){
    this.confirmRemoveProfile(entityId)
  }
  confirmRemoveProfile(entityId){
    Swal.fire({
      title: 'Bạn có chắc muốn xóa?',
      text: "Bạn sẽ không thể hoàn tác điều này!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#7367F0',
      preConfirm:   async () => {
      return this.removeProfile(entityId)
     },
      cancelButtonColor: '#E42728',
      cancelButtonText: "Thoát",
      confirmButtonText: 'Đúng, tôi muốn xóa!',
      customClass: {
        confirmButton: 'btn btn-primary',
        cancelButton: 'btn btn-danger ml-1'
      },
      allowOutsideClick:  () => {
        return !Swal.isLoading();
      }
    }).then(function (result:any) {
      if (result.value) {
        Swal.fire({
          icon: 'success',
          title: 'Thành công!',
          text: 'Bạn đã xóa thành công',
          customClass: {
            confirmButton: 'btn btn-success'
          }
        });
      }
    }
    
    );
  }
  // end remove profile item
  // remove list profile
  removeListProfile(){
    this.confirmRemoveListProfile();
  }
  confirmRemoveListProfile(){
    Swal.fire({
      title: 'Bạn có chắc muốn xóa?',
      text: "Bạn sẽ không thể hoàn tác điều này!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#7367F0',
      preConfirm:   async () => {
      return this.selected.map((profile) =>{
            this.removeProfile(profile.endEntityProfileId)
          });
     },
      cancelButtonColor: '#E42728',
      cancelButtonText: "Thoát",
      confirmButtonText: 'Đúng, tôi muốn xóa!',
      customClass: {
        confirmButton: 'btn btn-primary',
        cancelButton: 'btn btn-danger ml-1'
      },
      allowOutsideClick:  () => {
        return !Swal.isLoading();
      }
    }).then(function (result) {
      if (result.value) {
        Swal.fire({
          icon: 'success',
          title: 'Thành công!',
          text: 'Bạn đã xóa thành công',
          customClass: {
            confirmButton: 'btn btn-success'
          }
        });
      }
    }
    
    );
  }
  exportCSV(){
    // console.log(this.formListHsm2.value);
    this._entityProfileService
      .getListProfiles(JSON.stringify(this.formListProfile.value))
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((pagedData) => {
        console.log(pagedData)
        this.totalItems = pagedData.data.totalItems;
        console.log(pagedData);
        console.log(pagedData.data.data);
        this.dataExport = pagedData.data.data.map((profileList) => ({
          ...profileList,
          distinguishedName: profileList.distinguishedName.map((d) => d.name),
          alternativeName: profileList.alternativeName.map((d) => d.name),
        }));
        if (!this.dataExport || !this.dataExport.length) {
          return;
        }
        const separator = ',';
        const keys = Object.keys(this.dataExport[0]);
        const csvData =
          keys.join(separator) +
          '\n' +
          this.dataExport
            .map((row:any) => {
              return keys
                .map((k) => {
                  console.log(k)
                  console.log(row[k]);
                  // if(k === "distinguishedName"){
                  //   row[k] = row[k].distinguishedName
                  //   console.log(row[k]);
                  // }
                  // if(k === "distinguishedName"){
                  //   row[k] = row[k].distinguishedName
                  // }
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
          link.setAttribute('download', 'Danh Sách Profile');
          link.style.visibility = 'hidden';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      });
  }
  // end remove list profile
  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
