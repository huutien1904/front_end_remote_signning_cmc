import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { DateAdapter } from "@angular/material/core";
import { Router } from "@angular/router";
import { CoreConfigService } from "@core/services/config.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import {
  ColumnMode,
  DatatableComponent,
  SelectionType
} from "@swimlane/ngx-datatable";
import { PagedData } from "app/main/models/PagedData";
import { Personal } from "app/main/models/Personal";
import { ToastrService } from "ngx-toastr";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import * as XLSX from 'xlsx';
import { PersonalService } from "../personal.service";

type EXCEL = any[][];

@Component({
  selector: "app-personal-list",
  templateUrl: "./personal-list.component.html",
  styleUrls: ["./personal-list.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class PersonalListComponent implements OnInit {
  minDate: Date;
  maxDate: Date;
  // read file excel
  excelDataList:EXCEL = [];
  wopts: XLSX.WritingOptions = { bookType: 'xlsx', type: 'array' };
  fileName: string = 'SheetJS.xlsx';

  //public
  public totalItems:any = 0;
  public pagedData = new PagedData<Personal>();
  public rowsData = new Array<Personal>();
  public chkBoxSelected = [];
  public selected = [];
  public SelectionType = SelectionType;
  @ViewChild(DatatableComponent) table: DatatableComponent;
  @ViewChild("tableRowDetails") tableRowDetails: any;
  public isLoading: boolean = false;
  public ColumnMode = ColumnMode;
  public moreOption = true;
  
  public flag:any;
  public sizePage: number[] = [5, 10, 15, 20, 50, 100];
  gender: string[] = ["Nam", "Nữ"];
  public parentData:any[]=[];
  public openTable:boolean = true;
  public openTableUpdate:boolean = false;
  public contentHeader: object;
  // Private
  private _unsubscribeAll: Subject<any>;
  public formListPersonal: FormGroup;
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
            link: '/apps/ip/subscribers-create'
          }
        ]
      }
    };
    this.formListPersonal = this.fb.group({
      page: [""],
      size: [this.sizePage[3]],
      sort: [["staffId,asc"]],
      contains: ["", Validators.required],
      gender: [null],
      dateOfBirth: [""],
      fromDate: [""],
      toDate: [""],
    });
    this.setPage({ offset: 0, pageSize: this.formListPersonal.get("size").value  });
  }
  
  //Set Table View
  setPage(pageInfo) {
    console.log("check");
    console.log(pageInfo);
    this.isLoading=true;
    this.formListPersonal.patchValue({"page":pageInfo.offset}); 
    
    // this.pagedData.size = pageInfo.pageSize;
    console.log(JSON.stringify(this.formListPersonal.value));
    
    this._personalService
      .getListPersonals(JSON.stringify(this.formListPersonal.value))
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((pagedData) => {
        console.log(pagedData)
        this.totalItems = pagedData.data.totalItems
        this.pagedData = pagedData.data;
        this.rowsData = pagedData.data.data.map((personalList:any) => ({
          ...personalList,
          personalFirstName:
            personalList.firstName +
            " " +
            personalList.middleName +
            " " +
            personalList.lastName,
        }));
        console.log("check",this.rowsData);
        console.log(this.totalItems);
        this.isLoading=false;
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
    console.log("Select Event", selected, this.selected);
    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
  }
  onActivate(event) {
    if(!event.event.ctrlKey && event.event.type === 'click' && event.column.name!="Hành động") {
      this._router.navigate(['/apps/ip/subscribers/personals/personal-edit', event.row.staffId]);
      
    }
  }
  // Public Methods
  openNewPersonalModal(modal) {
    this.flag = this.modalService.open(modal, {
      centered: true,
      size: "xl",
    });
    console.log(this.flag)
  }
  closeModal(name) {
    this.modalService.dismissAll();
  }

  onSubmit() {
    console.log(this.formListPersonal.value)
    this.formListPersonal.patchValue({"size":null}); 
    this.setPage({ offset: 0, pageSize: this.formListPersonal.get("size").value  });
    // if(this.formListPersonal.value.birthday !== null){
    //   let birthday = this.formListPersonal.value.birthday._i.date + "/" + this.formListPersonal.value.birthday._i.month + "/" + this.formListPersonal.value.birthday._i.year
    //   this.formListPersonal.controls['birthday'].setValue(birthday);
    // }
    // if(this.formListPersonal.value.gender !== null){
    //   this.body.contains = this.formListPersonal.value.gender
    // }
    // console.log(this.formListPersonal.value);
    // this.body.contains = this.formListPersonal.value.inputPersonal
    // this._personalService
    //   .searchPersonal(JSON.stringify(this.formListPersonal.value))
    //   .pipe(takeUntil(this._unsubscribeAll))
    //   .subscribe((pagedData) => {
    //     console.log(pagedData)
    //     this.totalItems = pagedData.data.totalItems
    //     this.pagedData = pagedData.data;
    //     this.rowsData = pagedData.data.data.map((personalList:any) => ({
    //       ...personalList,
    //       personalFirstName:
    //         personalList.firstName +
    //         " " +
    //         personalList.middleName +
    //         " " +
    //         personalList.lastName,
    //     }));
    //     console.log("check1",this.rowsData);
    //     console.log(this.totalItems);
    //     this.isLoading=false;
    // });
  }
  updateTableOnDelete(){
    this.pagedData.size = this.sizePage[3];
    this.pagedData.currentPage = 0;
    this.setPage({ offset: 0, pageSize: this.pagedData.size });
  }
  updateTableOnAdd(){
    console.log(this.rowsData)
    const finalTable:any = this.rowsData;
    this.rowsData = finalTable[0];
    console.log(finalTable[0]);
    this.pagedData.size = this.sizePage[3];
    this.pagedData.currentPage = 0;
    this.setPage({ offset: 0, pageSize: this.pagedData.size });
  }
  deletePersonal(staffId){
    this._personalService
        .deletePersonal(staffId)
        .subscribe((res) =>{
            this._toastrService.success(
              "Xóa Thuê Bao cá nhân thành công ",   
              "Thành công",
              { toastClass: "toast ngx-toastr", closeButton: true }
            );
            this.setPage({
              offset: 0,
              pageSize: this.formListPersonal.controls.size
            })
        })
  }

  onInputExcel(event:any){
    const targetFileExcel:DataTransfer = <DataTransfer>(event.target);
    const reader:FileReader = new FileReader();
    reader.onload = (e: any) => {
      /* read workbook */
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

      /* grab first sheet */
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      /* save data */
      this.excelDataList = <EXCEL>(XLSX.utils.sheet_to_json(ws, { header: 1 }));
      if(this.excelDataList.length > 1){
        this.openTableUpdate = true;
        this.openTable = false;
      }
      this.excelDataList.splice(0,1)
      this.excelDataList.map((item, index) => {
        if (item.length < 0) {
          this.excelDataList.splice(index, 1);
        }
      });
      // convert to array object
      console.log(this.excelDataList);
      this.parentData = [];
      // var arrayList:any = [];
      this.excelDataList.map((item,index) => {
        var listPersonals:any = {
          'personalFirstName':"",
          'personalMiddleName':"",
          'personalLastName':"",
          'personalCountryId':"",
          'birthday':"",
          'gender':"",
          'email':"",
          'phoneNumber':"",
          
          "streetBirthPlace":"28",
          "countryBirthPlace":"237",
          "provinceBirthPlace":"11",
          "districtBirthPlace":"100",
          "communeBirthPlace":"3331",
          "homeNumberBirthPlace":"12",
          "countryResidencePlace":"237",
          "provinceResidencePlace":"11",
          "districtResidencePlace":"99",
          "communeResidencePlace":"3274",
          "streetResidencePlace":"20",
          "homeNumberResidencePlace":"12"
        }
        item.map((value,index) =>{
          if(index === 0)  listPersonals.personalFirstName = value
          if(index === 1)  listPersonals.personalMiddleName = value
          if(index === 2)  listPersonals.personalLastName = value
          if(index === 3)  listPersonals.personalCountryId = value
          if(index === 4)  listPersonals.birthday = value
          if(index === 5)  listPersonals.gender = value
          if(index === 6)  listPersonals.email = value
          if(index === 7)  listPersonals.phoneNumber = value  
        })
        
        this.parentData.push(listPersonals);
      })
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
  toggleTable(){
    this.openTableUpdate = false;
    this.openTable = true;
    this.setPage({ offset: 0, pageSize: this.pagedData.size });
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
