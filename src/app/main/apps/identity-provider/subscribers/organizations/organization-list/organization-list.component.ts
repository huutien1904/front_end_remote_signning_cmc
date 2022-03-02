import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import {
  ColumnMode,
  DatatableComponent,
  SelectionType,
} from '@swimlane/ngx-datatable';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { PagedData } from 'app/main/models/PagedData';
import { OrganizationListService } from './organization-list.service';
import {
  Organization,
  OrganizationCategory,
} from 'app/main/models/Organization';
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AddressService } from '../../../address.service';
type EXCEL = any[][];
@Component({
  selector: 'app-organization-list',
  templateUrl: './organization-list.component.html',
  styleUrls: ['./organization-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class OrganizationListComponent implements OnInit {
  // variable
  public moreOption = true;
  //Table of personal data
  public isLoading: boolean = false;
  public pagedData = new PagedData<Organization>();
  public rowsData = new Array<Organization>();
  public chkBoxSelected = [];
  public selected = [];
  public SelectionType = SelectionType;
  @ViewChild(DatatableComponent) table: DatatableComponent;
  @ViewChild('tableRowDetails') tableRowDetails: any;
  public ColumnMode = ColumnMode;
  public sizePage: number[] = [5, 10, 15, 20, 50, 100];
  public typeOrganization: any[];
  public flag: any;
  public openTable: boolean = true;
  public openTableUpdate: boolean = false;
  public parentData: any[] = [];
  public totalItems: any = 0;
  public dataExport: any;
  public data:any = {};
  public address: any;
  // end variable
  //private
  excelDataList: EXCEL = [];
  private _unsubscribeAll: Subject<any>;
  public formListOrganizations: FormGroup;
  //function

  onSubmit() {}
  selectItem(event) {}
  // end

  /**
   * Constructor
   *
   * @param {CoreConfigService} _coreConfigService
   * @param {OrganizationListService} OrganizationListService
   * @param {CoreSidebarService} _coreSidebarService
   */
  constructor(
    private _organizationListService: OrganizationListService,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private _router: Router,
    private _toastrService: ToastrService,
    private _addressService: AddressService
  ) {
    this._unsubscribeAll = new Subject();
  }

  // Public Methods
  // -----------------------------------------------------------------------------------------------------
  openNewOrganizationModal(modal) {
    this.flag = this.modalService.open(modal, {
      centered: true,
      size: 'xl',
    });
  }
  closeModal() {
    this.flag.close();
  }

  /**
   * Filter By Roles
   *
   * @param event
   */
  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------
  /**
   * On init
   */
  async ngOnInit() {
    this.formListOrganizations = this.fb.group({
      inputOrganization: ['', Validators.required],
      sizePage: [this.sizePage[3], Validators.required],
      typeOrganization: [null, Validators.required],
    });

    // this.typeOrganization = await this._organizationListService
    //   .getListOrganizationCategory()
    //   .subscribe((res: any) => {
    //     this.typeOrganization = res.data;
    //     console.log(this.typeOrganization);
    //   });
    // this.getOrganization();
    this.pagedData.size = this.sizePage[3];
    this.pagedData.currentPage = 0;
    this.setPage({ offset: 0, pageSize: this.pagedData.size });
    this.getListTypeOrganization();
    this.setPage({
      offset: 0,
      pageSize: this.formListOrganizations.get('sizePage').value,
    });
  }
  // getOrganization() {
  //   this._organizationListService
  //     .searchOrganizations(JSON.stringify(this.formListOrganizations.value))
  //     .pipe(takeUntil(this._unsubscribeAll))
  //     .subscribe((pagedData) => {
  //       this.pagedData = pagedData.data;
  //       console.log(this.pagedData);
  //       this.typeOrganization = pagedData.data.data.map((organizationList) => ({
  //         ...organizationList,
  //       }));
  //       console.log(this.typeOrganization);
  //     });
  // }
  //Set Table View
  setPage(pageInfo) {
    console.log(pageInfo);
    this.isLoading = true;
    this.pagedData.currentPage = pageInfo.offset;
    this.pagedData.size = pageInfo.pageSize;
    this.formListOrganizations.patchValue({ page: pageInfo.offset });
    this._organizationListService
      .searchOrganizations(this.pagedData)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((pagedData) => {
        this.pagedData = pagedData.data;
        this.rowsData = pagedData.data.data.map((organizationList) => ({
          ...organizationList,
        }));
        this.data = this.rowsData[0].address;
        this.address = this.data.provinceId;
        console.log(this.data);
        console.log(this.address);
        console.log('check 115');
        console.log(this.rowsData);
        console.log(this.pagedData);
        this.isLoading = false;
      });
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

  onActivate(event) {
    // console.log(event);
    if (
      !event.event.ctrlKey &&
      event.event.type === 'click' &&
      event.column.name != 'Hành động' &&
      event.column.name != 'checkbox'
    ) {
      this._router.navigate([
        '/apps/ip/subscribers/organizations/organization-edit',
        event.row.organizationId,
      ]);
    }
  }
  onUpdateTable() {
    this.pagedData.size = this.sizePage[3];
    this.pagedData.currentPage = 0;
    this.setPage({ offset: 0, pageSize: this.pagedData.size });
  }
  getListTypeOrganization() {
    this._organizationListService
      .getListOrganizationCategory()
      .subscribe((res: any) => {
        this.typeOrganization = res.data;
        console.log(this.typeOrganization);
      });
  }
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

      // close official table open unofficial table
      if (this.excelDataList.length > 1) {
        this.openTableUpdate = true;
        this.openTable = false;
      }
      // remove item title table excel
      this.excelDataList.splice(0, 1);
      this.excelDataList.map((item, index) => {
        if (item.length < 0) {
          this.excelDataList.splice(index, 1);
        }
      });
      // convert to array object
      console.log(this.excelDataList);
      // this.parentData = [];
      // var arrayList:any = [];
      this.excelDataList.map((item, index) => {
        var listOrganizations: any = {
          organizationName: '',
          countryOrganizationId: '',
          subscriberCategoryId: '',
          phoneNumber: '',
          email: '',
          website: '',
          leaderName: '',
          parentOrganizationId: '',
          street: '',
          country: '',
          province: '',
          district: '',
          commune: '',
          homeNumber: '',
        };
        item.map((value, index) => {
          if (index === 0) listOrganizations.organizationName = value;
          if (index === 1) listOrganizations.countryOrganizationId = value;
          if (index === 2) listOrganizations.phoneNumber = value;
          if (index === 3) listOrganizations.email = value;
          if (index === 4) listOrganizations.website = value;
          if (index === 5) listOrganizations.parentOrganizationId = value;
        });

        this.parentData.push(listOrganizations);
      });
      console.log(this.parentData);
      // this.parentData = arrayList
      // arrayList.map((item,index) => {
      //   const currentUser = JSON.parse(localStorage.getItem("currentUser"));
      //   const token = currentUser.token;
      //   const newPersonal = JSON.stringify(item);
      //   console.log(newPersonal);
      // this._personalListService.submitForm(newPersonal).subscribe((res: any) => {
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
  }
  // removeListPersonal(){
  //   if(this.selected.length > 0){
  //     this.confirmOpenDeleteListPersonal();
  //   }
  // }
  // confirmOpenDeleteListPersonal(){
  //   Swal.fire({
  //     title: 'Bạn có chắc muốn xóa?',
  //     text: "Bạn sẽ không thể hoàn tác điều này!",
  //     icon: 'warning',
  //     showCancelButton: true,
  //     confirmButtonColor: '#7367F0',
  //     preConfirm:   async () => {
  //     return this.selected.map((pesonal) =>{
  //           this.deletePersonal(pesonal.staffId)
  //         });
  //    },
  //     cancelButtonColor: '#E42728',
  //     cancelButtonText: "Thoát",
  //     confirmButtonText: 'Đúng, tôi muốn xóa!',
  //     customClass: {
  //       confirmButton: 'btn btn-primary',
  //       cancelButton: 'btn btn-danger ml-1'
  //     },
  //     allowOutsideClick:  () => {
  //       return !Swal.isLoading();
  //     }
  //   }).then(function (result) {
  //     if (result.value) {
  //       Swal.fire({
  //         icon: 'success',
  //         title: 'Thành công!',
  //         text: 'Bạn đã xóa thành công',
  //         customClass: {
  //           confirmButton: 'btn btn-success'
  //         }
  //       });
  //     }
  //   }

  //   );
  // }
  // deletePersonal(staffId){
  //   this._organizationListService
  //       .deletePersonal(staffId)
  //       .subscribe((res) =>{
  //           this._toastrService.success(
  //             "Xóa Thuê Bao cá nhân thành công ",
  //             "Thành công",
  //             { toastClass: "toast ngx-toastr", closeButton: true }
  //           );
  //           this.setPage({
  //             offset: 0,
  //             pageSize: this.formListOrganizations.controls.size
  //           })
  //       })
  // }

  exportCSV() {
    this._organizationListService
      .searchOrganizations(JSON.stringify(this.formListOrganizations.value))
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((pagedData) => {
        this.totalItems = pagedData.data.totalItems;
        console.log(pagedData);
        console.log(pagedData.data.data);
        this.dataExport = pagedData.data.data.map(
          async (personalList: any) => ({
            ...personalList,
            address: await this._addressService
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
          })
        );
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
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
