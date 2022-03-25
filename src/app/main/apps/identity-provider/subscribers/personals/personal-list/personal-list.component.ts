import { async } from '@angular/core/testing';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { Router } from '@angular/router';
import { CoreConfigService } from '@core/services/config.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  ColumnMode,
  DatatableComponent,
  SelectionType,
} from '@swimlane/ngx-datatable';
import { PagedData } from 'app/main/models/PagedData';
import { Personal } from 'app/main/models/Personal';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as XLSX from 'xlsx';
import { PersonalService } from '../personal.service';
import Swal from 'sweetalert2';
import { AddressService } from '../../../address.service';

type EXCEL = any[][];

@Component({
  selector: 'app-personal-list',
  templateUrl: './personal-list.component.html',
  styleUrls: ['./personal-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class PersonalListComponent implements OnInit {
  minDate: Date;
  maxDate: Date;
  // read file excel
  excelDataList: EXCEL = [];
  wopts: XLSX.WritingOptions = { bookType: 'xlsx', type: 'array' };
  fileName: string = 'SheetJS.xlsx';

  //public
  public totalItems: any = 0;
  public pagedData = new PagedData<Personal>();
  public rowsData = new Array<Personal>();
  public rows: any;
  public chkBoxSelected = [];
  public selected = [];
  public SelectionType = SelectionType;
  @ViewChild(DatatableComponent) table: DatatableComponent;
  @ViewChild('tableRowDetails') tableRowDetails: any;
  public isLoading: boolean = false;
  public ColumnMode = ColumnMode;
  public moreOption = true;
  public searchType = [
    {
      id: 1,
      key: 'Cá nhân',
      name: 'Cá nhân',
    },
    {
      id: 2,
      key: 'Tổ chức',
      name: 'Tổ chức',
    },
    {
      id: 3,
      key: 'Thiết bị/dịch vụ',
      name: 'Thiết bị/dịch vụ',
    },
  ];

  public flag: any;
  public sizePage: number[] = [5, 10, 15, 20, 50, 100];
  gender: string[] = ['Nam', 'Nữ'];
  public parentData: any[] = [];
  public organizations: any[] = [];
  public openTable: boolean = true;
  public openTableUpdate: boolean = false;
  public contentHeader: object;
  public dataExport: any;
  // Private
  private _unsubscribeAll: Subject<any>;
  public formListPersonal: FormGroup;
  public formSelectSearch: FormGroup;
  /**
   *
   * @param _personalService
   * @param _coreConfigService
   * @param modalService
   * @param fb
   * @param dateAdapter
   * @param dateAdapter
   */
  constructor(
    private _personalService: PersonalService,
    private _coreConfigService: CoreConfigService,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private _router: Router,
    private dateAdapter: DateAdapter<any>,
    private _toastrService: ToastrService,
    private _addressService: AddressService
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

  /**
   * On init
   */
  ngOnInit(): void {
    this.contentHeader = {
      headerTitle: 'Tạo thuê bao',
      actionButton: true,
      breadcrumb: {
        type: 'chevron',
        links: [
          {
            name: 'Quản lý người dùng',
            isLink: false,
          },
          {
            name: 'Tạo thuê bao',
            isLink: true,
            link: '/apps/ip/subscribers-create',
          },
        ],
      },
    };
    this.formListPersonal = this.fb.group({
      page: [''],
      size: [this.sizePage[3]],
      sort: [['staffId,asc']],
      contains: ['', Validators.required],
      gender: [this.gender[0]],
      dateOfBirth: [''],
      fromDate: [''],
      toDate: [''],
      searchType: [this.searchType[0], Validators.required],
      organizations: [this.organizations[0]],
    });
    this.setPage({
      offset: 0,
      pageSize: this.formListPersonal.get('size').value,
    });
    this.getAllOrganizations();
    // this.formSelectSearch = this.fb.group({
    //   searchType : [this.searchType[0], Validators.required]
    // })
  }
  //get organizations
  getAllOrganizations() {
    this._personalService
      .getOrganizationId()
      .subscribe((response: any) => {
        this.organizations = response.data;
        this.formListPersonal.controls['organizations'].setValue(this.organizations[0]);
        console.log(this.organizations);
      });
  }

  //Set Table View
  setPage(pageInfo) {
    console.log('check');
    console.log(pageInfo);
    this.isLoading = true;
    this.formListPersonal.patchValue({ page: pageInfo.offset });

    // this.pagedData.size = pageInfo.pageSize;
    console.log(JSON.stringify(this.formListPersonal.value));

    this._personalService
      .getListPersonals(JSON.stringify(this.formListPersonal.value))
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((pagedData) => {
        console.log(pagedData);
        this.totalItems = pagedData.data.totalItems;
        this.pagedData = pagedData.data;
        this.rowsData = pagedData.data.data.map((personalList: any) => ({
          ...personalList,
          personalFirstName:
            personalList.firstName +
            ' ' +
            personalList.middleName +
            ' ' +
            personalList.lastName,
        }));
        console.log('check', this.rowsData);
        console.log(this.totalItems);
        this.isLoading = false;
      });
    // this._personalService
    //   .getStaffSelf()
    //   .pipe(takeUntil(this._unsubscribeAll))
    //   .subscribe((res) => {
    //     console.log(res);
    //     this.rows = res.data;
    //     console.log(this.rows);
    //   });
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
    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
    console.log('Select Event', selected, this.selected);
  }
  onActivate(event) {
    // console.log(event);
    if (
      !event.event.ctrlKey &&
      event.event.type === 'click' &&
      event.column.name != 'Hành động' &&
      event.column.name != 'checkbox'
    ) {
      this._router.navigate([
        '/apps/ip/subscribers/personals/personal-edit',
        event.row.staffId,
      ]);
    }
  }
  // Public Methods
  openNewPersonalModal(modal) {
    this.flag = this.modalService.open(modal, {
      centered: true,
      size: 'xl',
    });
    console.log(this.flag);
  }
  closeModal(name) {
    this.modalService.dismissAll();
  }

  onSubmit() {
    console.log(this.formListPersonal.value);
    this.formListPersonal.patchValue({ size: null });
    this.setPage({
      offset: 0,
      pageSize: this.formListPersonal.get('size').value,
    });
  }
  updateTableOnDelete() {
    this.pagedData.size = this.sizePage[3];
    this.pagedData.currentPage = 0;
    this.setPage({ offset: 0, pageSize: this.pagedData.size });
  }
  updateTableOnAdd() {
    console.log(this.rowsData);
    const finalTable: any = this.rowsData;
    this.rowsData = finalTable[0];
    console.log(finalTable[0]);
    this.pagedData.size = this.sizePage[3];
    this.pagedData.currentPage = 0;
    this.setPage({ offset: 0, pageSize: this.pagedData.size });
  }
  deletePersonal(staffId) {
    this._personalService.deletePersonal(staffId).subscribe((res) => {
      this._toastrService.success(
        'Xóa Thuê Bao cá nhân thành công ',
        'Thành công',
        { toastClass: 'toast ngx-toastr', closeButton: true }
      );
      this.setPage({
        offset: 0,
        pageSize: this.formListPersonal.controls.size,
      });
    });
  }
  confirmRemovePersonal(staffId) {
    Swal.fire({
      title: 'Bạn có chắc muốn xóa?',
      text: 'Bạn sẽ không thể hoàn tác điều này!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#7367F0',
      preConfirm: async () => {
        this.deletePersonal(staffId);
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
    }).then(function (result: any) {
      console.log(result);
      if (result.value) {
        Swal.fire({
          icon: 'success',
          title: 'Thành công!',
          text: 'Bạn đã xóa thành công',
          customClass: {
            confirmButton: 'btn btn-success',
          },
        });
      }
    });
  }
  // removeListPersonal() {
  //   if (this.selected.length > 0) {
  //     this.confirmOpenDeleteListPersonal();
  //   }
  // }
  
  openConfirmDelete(staffId) {
    console.log(staffId);
    this.confirmRemovePersonal(staffId);
  }
  confirmOpenDeleteListPersonal() {
    Swal.fire({
      title: 'Bạn có chắc muốn xóa?',
      text: 'Bạn sẽ không thể hoàn tác điều này!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#7367F0',
      preConfirm: async () => {
        return this.selected.map((pesonal) => {
          this.deletePersonal(pesonal.staffId);
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
          text: 'Bạn đã xóa thành công',
          customClass: {
            confirmButton: 'btn btn-success',
          },
        });
      }
    });
  }
  removeListPersonal() {
    if(this.selected.length > 0){
      Swal.fire({
        title: 'Bạn có chắc muốn xóa?',
        text: 'Bạn sẽ không thể hoàn tác điều này!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#7367F0',
        preConfirm: async () => {
           this.selected.map((personal) => {
            this.deletePersonal(personal.staffId);
          });
          this.chkBoxSelected = []
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
      }).then(function (result:any) {
        if (result.value) {
          Swal.fire({
            icon: 'success',
            title: 'Thành công!',
            text: 'Bạn đã xóa thành công',
            customClass: {
              confirmButton: 'btn btn-success',
            },
          });
        }
      });
    }
  }
  // removeListPersonal(){
  //   this.selected.map((pesonal) =>{
  //     this.deletePersonal(pesonal.staffId)
  //   })
  // }
  onInputExcel(event: any) {
    const targetFileExcel: DataTransfer = <DataTransfer>event.target;
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      /* read workbook */
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

      /* grab first sheet */
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      /* save data */
      this.excelDataList = <EXCEL>XLSX.utils.sheet_to_json(ws, { header: 1 });
      if (this.excelDataList.length > 1) {
        this.openTableUpdate = true;
        this.openTable = false;
      }
      this.excelDataList.splice(0, 1);
      this.excelDataList.map((item, index) => {
        if (item.length < 0) {
          this.excelDataList.splice(index, 1);
        }
      });
      // convert to array object
      console.log(this.excelDataList);
      this.parentData = [];
      // var arrayList:any = [];
      this.excelDataList.map((item, index) => {
        var listPersonals: any = {
          personalFirstName: '',
          personalMiddleName: '',
          personalLastName: '',
          personalCountryId: '',
          birthday: '',
          gender: '',
          email: '',
          phoneNumber: '',

          streetBirthPlace: '28',
          countryBirthPlace: '237',
          provinceBirthPlace: '11',
          districtBirthPlace: '100',
          communeBirthPlace: '3331',
          homeNumberBirthPlace: '12',
          countryResidencePlace: '237',
          provinceResidencePlace: '11',
          districtResidencePlace: '99',
          communeResidencePlace: '3274',
          streetResidencePlace: '20',
          homeNumberResidencePlace: '12',
        };
        item.map((value, index) => {
          if (index === 0) listPersonals.personalFirstName = value;
          if (index === 1) listPersonals.personalMiddleName = value;
          if (index === 2) listPersonals.personalLastName = value;
          if (index === 3) listPersonals.personalCountryId = value;
          if (index === 4) listPersonals.birthday = value;
          if (index === 5) listPersonals.gender = value;
          if (index === 6) listPersonals.email = value;
          if (index === 7) listPersonals.phoneNumber = value;
        });

        this.parentData.push(listPersonals);
      });
      console.log(this.parentData);
      // this.parentData = arrayList
      // arrayList.map((item,index) => {
      //   const currentUser = JSON.parse(localStorage.getItem("currentUser"));
      //   const token = currentUser.token;
      //   const newPersonal = JSON.stringify(item);
      //   console.log(newPersonal);
      // this._personalService.submitForm(newPersonal).subscribe((res: any) => {
      //   if(res.result === true){
      //     this.updateTableOnAdd();
      //   }
      // });
      // })
    };
    reader.readAsBinaryString(targetFileExcel.files[0]);
    // this.openNewPersonalModal(modalBasic)
  }
  toggleTable() {
    this.openTableUpdate = false;
    this.openTable = true;
    this.setPage({ offset: 0, pageSize: this.pagedData.size });
  }

  exportCSV() {
    const body = {
      page: null,
      size: 20,
      sort: ['staffId,asc'],
      contains: '',
      fromDate: '',
      toDate: '',
      gender: '',
      dateOfBirth: '',
    };
    this._personalService
      .getListPersonals(body)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((pagedData) => {
        this.totalItems = pagedData.data.totalItems;
        console.log(pagedData);
        console.log(pagedData.data.data);
        this.dataExport = pagedData.data.data.map((personalList: any) => ({
          ...personalList,
          address: this._addressService
            .getAddressById(personalList.address.addressId)
            .pipe(takeUntil(this._unsubscribeAll))
            .toPromise()
            .then((res) => {
              //  console.log(res)
              console.log(res.data.streetName);
              return (
                'số nhà ' +
                res.data.houseNumber +
                'Đường ' +
                res.data.streetName +
                'Xã ' +
                res.data.communeName
              );
              //  row[k] = res.data.districtName
            }),
          birthPlace: this._addressService
            .getAddressById(personalList.address.addressId)
            .pipe(takeUntil(this._unsubscribeAll))
            .toPromise()
            .then((res) => {
              console.log(res);
              console.log(res.data.streetName);
              return (
                'số nhà ' +
                res.data.houseNumber +
                'Đường ' +
                res.data.streetName +
                'Xã ' +
                res.data.communeName
              );
              //  row[k] = res.data.districtName
            }),
        }));
        console.log(this.dataExport);
        if (!this.dataExport || !this.dataExport.length) {
          return;
        }
        // console.log(this.dataExport)
        const separator = ',';
        const keys = Object.keys(this.dataExport[0]);
        const csvData =
          keys.join(separator) +
          '\n' +
          this.dataExport
            .map((row: any) => {
              return keys
                .map((k) => {
                  if (k == 'address') {
                    // row[k] = row[k].__zone_symbol__value
                    console.log(row[k]);

                    console.log(row[k].__zone_symbol__value);
                  }
                  //   let cell =
                  //   row[k] === null || row[k] === undefined ? '' : row[k];
                  // cell =
                  //   cell instanceof Date
                  //     ? cell.toLocaleString()
                  //     : cell.toString().replace(/"/g, '""');
                  // console.log("cell",cell);
                  // if (cell.search(/("|,|\n)/g) >= 0) {
                  //   cell = `"${cell}"`;
                  // }
                  // }
                  // let cell ;
                  // if(k != "address"){
                  //   let cell =
                  //     row[k] === null || row[k] === undefined ? '' : row[k];
                  //   cell =
                  //     cell instanceof Date
                  //       ? cell.toLocaleString()
                  //       : cell.toString().replace(/"/g, '""');
                  //   console.log("cell",cell);
                  //   if (cell.search(/("|,|\n)/g) >= 0) {
                  //     cell = `"${cell}"`;
                  //   }
                  //   return cell;

                  // }
                  let cell =
                    row[k] === null || row[k] === undefined ? '' : row[k];
                  cell =
                    cell instanceof Date
                      ? cell.toLocaleString()
                      : cell.toString().replace(/"/g, '""');
                  console.log('cell', cell);
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
          link.setAttribute('download', 'Danh Sách người dùng');
          link.style.visibility = 'hidden';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      });
  }

  getAddressById(id) {
    this._addressService
      .getAddressById(id)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((res) => {
        return res;
      });
  }
  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe frof all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
