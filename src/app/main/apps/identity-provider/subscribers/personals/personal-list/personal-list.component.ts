import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { DateAdapter } from "@angular/material/core";
import { CoreSidebarService } from "@core/components/core-sidebar/core-sidebar.service";
import { CoreConfigService } from "@core/services/config.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import {
  ColumnMode,
  DatatableComponent,
  SelectionType,
} from "@swimlane/ngx-datatable";
import { PagedData } from "app/main/models/PagedData";
import { Personal } from "app/main/models/Personal";
import { ifError } from "assert";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { PersonalListService } from "./personal-list.service";
import { ToastrService } from "ngx-toastr";
import * as XLSX from 'xlsx';

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

  //Table of personal data
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
  // Private
  private _unsubscribeAll: Subject<any>;
  public formListPersonal: FormGroup;

  /**
   *
   * @param _personalListService
   * @param _coreSidebarService
   * @param _coreConfigService
   * @param modalService
   * @param fb
   * @param dateAdapter
   * @param dateAdapter
   */
  constructor(
    private _personalListService: PersonalListService,
    private _coreSidebarService: CoreSidebarService,
    private _coreConfigService: CoreConfigService,
    private modalService: NgbModal,
    private fb: FormBuilder,
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
    this.formListPersonal = this.fb.group({
      inputPersonal: [null, Validators.required],
      fromDate: [null],
      toDate: [null],
      sizePage: [this.sizePage[3]],
      gender: [],
      birthday: [],
    });
    this.pagedData.size = this.sizePage[3];
    this.pagedData.currentPage = 0;
    this.setPage({ offset: 0, pageSize: this.pagedData.size });
  }
  changePage() {
    this.pagedData.size = this.formListPersonal.get("sizePage").value;
    this.setPage({ offset: 0, pageSize: this.pagedData.size });
  }

  //Set Table View
  setPage(pageInfo) {
    console.log(pageInfo);
    this.isLoading=true;
    this.pagedData.currentPage = pageInfo.offset;
    this.pagedData.size = pageInfo.pageSize;
    this._personalListService
      .getListPersonals(this.pagedData)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((pagedData) => {
        
        this.totalItems = pagedData.data.totalItems
        this.pagedData = pagedData.data;
        this.rowsData = pagedData.data.data.map((personalList) => ({
          ...personalList,
          personalFirstName:
            personalList.personalFirstName +
            " " +
            personalList.personalMiddleName +
            " " +
            personalList.personalLastName,
        }));
        console.log(this.rowsData);
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
    console.log(this.formListPersonal);
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
  }
  deletePersonal(personalID){
    this._personalListService
        .deletePersonal(personalID)
        .subscribe((res) =>{
          const result = res
            this.updateTableOnDelete();
            this._toastrService.success(
              "Xóa Thuê Bao cá nhân thành công ",   
              "Thành công",
              { toastClass: "toast ngx-toastr", closeButton: true }
            )
        })
  }

  onInputExcel(event:any){
    const targetFileExcel:DataTransfer = <DataTransfer>(event.target);
    const reader:FileReader = new FileReader();
    console.log("check test")
    reader.onload = (e: any) => {
      /* read workbook */
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

      /* grab first sheet */
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      /* save data */
      this.excelDataList = <EXCEL>(XLSX.utils.sheet_to_json(ws, { header: 1 }));
      this.excelDataList.splice(0,1)
      // convert to array object
      var listPersonals:any = {
        'personalFirstName':"",
        'personalMiddleName':"",
        'personalLastName':"",
        'personalCountryId':"",
        'birthday':"",
        'gender':"",
        'email':"",
        'phoneNumber':"",
        "organizationId":"organization_02004",
        "streetBirthPlace":28,
        "countryBirthPlace":237,
        "provinceBirthPlace":11,
        "districtBirthPlace":100,
        "communeBirthPlace":3331,
        "homeNumberBirthPlace":"12",
        "countryResidencePlace":237,
        "provinceResidencePlace":11,
        "districtResidencePlace":99,
        "communeResidencePlace":3274,
        "streetResidencePlace":20,
        "homeNumberResidencePlace":"12"
      }
      var arrayList:any = [];
      console.log(this.excelDataList);
      this.excelDataList.map((item) => {
        item.forEach((value,index) =>{
          if(index === 0)  listPersonals.personalFirstName = value
          if(index === 1)  listPersonals.personalMiddleName = value
          if(index === 2)  listPersonals.personalLastName = value
          if(index === 3)  listPersonals.personalCountryId = value
          if(index === 4)  listPersonals.birthday = value
          if(index === 5)  listPersonals.gender = value
          if(index === 6)  listPersonals.email = value
          if(index === 7)  listPersonals.phoneNumber = value  
        }) 
        arrayList.push(listPersonals)
      })
      console.log(arrayList);
      arrayList.map((item,index) => {
        const currentUser = JSON.parse(localStorage.getItem("currentUser"));
        const token = currentUser.token;
        const newPersonal = JSON.stringify(item);
        console.log(newPersonal);
        this._personalListService.submitForm(newPersonal).subscribe((res: any) => {
          if(res.result === true){
            this.updateTableOnAdd();
          }
        });
      })
    };
    reader.readAsBinaryString(targetFileExcel.files[0]);
    // this.openNewPersonalModal(modalBasic)
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
