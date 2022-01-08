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
        }));
        this.isLoading = false;
      });
  }
  // set active row
  onActivate(event) {
    if(event.event.type === 'click' && event.column.name!="Hành động" && event.column.name!="checkbox") {
      this._router.navigate(['/apps/ip/profiles/profile-view', event.row.endEntityProfileId]);
    }
  }
  // remove profile item
  removeProfile(entityId){
    console.log(entityId);
    // this.confirmRemoveProfile(entityId)
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
  confirmRemoveProfile(entityId){
    Swal.fire({
      title: 'Bạn có chắc muốn xóa?',
      text: "Bạn sẽ không thể hoàn tác điều này!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#7367F0',
      preConfirm:   async () => {
        console.log("checy cai nay chua")
      this._entityProfileService
      .deleteProfileId(entityId)
      .pipe(takeUntil(this._unsubscribeAll))
      .toPromise().then(res=>{
        if(res.result==false){
          throw new Error(res.message);
        }
        return res;
      }).catch(
        function (error) {
          Swal.showValidationMessage('Mã lỗi:  ' + error + '');
        }
      );
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
      console.log(result);
      if (result.value) {
        Swal.fire({
          icon: 'success',
          title: 'Thành công!',
          text: 'Bạn đã xóa thành công',
          customClass: {
            confirmButton: 'btn btn-success'
          }
        });
        // this.setPage({
        //   offset: 0,
        //   pageSize: this.formListProfile.controls.size
        // })
      }
    }
    
    );
  }
  // end remove profile item
  // remove list profile
  removeListProfile(){
    
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
