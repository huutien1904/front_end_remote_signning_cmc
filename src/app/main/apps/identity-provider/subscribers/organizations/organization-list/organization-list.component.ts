import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ColumnMode, DatatableComponent,SelectionType } from '@swimlane/ngx-datatable';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Subject } from 'rxjs';
import { takeUntil } from "rxjs/operators";
import { PagedData } from "app/main/models/PagedData";
import { OrganizationListService } from './organization-list.service';
import { Organization, OrganizationCategory } from 'app/main/models/Organization';
import * as XLSX from 'xlsx';
type EXCEL = any[][];
@Component({
  selector: 'app-organization-list',
  templateUrl: './organization-list.component.html',
  styleUrls: ['./organization-list.component.scss'],
  encapsulation: ViewEncapsulation.None

})
export class OrganizationListComponent implements OnInit {
  // variable
  public moreOption = true
  //Table of personal data
  public isLoading: boolean = false;
  public pagedData = new PagedData<Organization>();
  public rowsData = new Array<Organization>();
  public chkBoxSelected = [];
  public selected = [];
  public SelectionType = SelectionType;
  @ViewChild(DatatableComponent) table: DatatableComponent;
  @ViewChild("tableRowDetails") tableRowDetails: any;
  public ColumnMode = ColumnMode;
  public sizePage: number[] = [5, 10, 15, 20, 50, 100];
  public typeOrganization:OrganizationCategory[] ;
  public flag:any;
  public openTable:boolean = true;
  public openTableUpdate:boolean = false;
  public parentData:any[]=[];
  // end variable
  //private
  excelDataList:EXCEL = [];
  private _unsubscribeAll: Subject<any>;
  public formListOrganizations: FormGroup;
  //function
  
  onSubmit(){

  }
  selectItem(event){

  }
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
  ) { 
    this._unsubscribeAll = new Subject();
   }
  
  // Public Methods
  // -----------------------------------------------------------------------------------------------------
  openNewOrganizationModal(modal){
    this.flag = this.modalService.open(modal, {
      centered:true,
      size:'xl'
    });
  }
  closeModal(){
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
  ngOnInit(): void {
    this.formListOrganizations = this.fb.group({
      inputOrganization: ["", Validators.required],
      sizePage:[this.sizePage[3], Validators.required],
      typeOrganization:[null, Validators.required],
    })
    this.pagedData.size = this.sizePage[3];
    this.pagedData.currentPage = 0;
    this.setPage({ offset: 0, pageSize: this.pagedData.size });
    this.getListTypeOrganization();
  }

  //Set Table View
  setPage(pageInfo) {
    console.log(pageInfo);
    this.isLoading=true;
    this.pagedData.currentPage = pageInfo.offset;
    this.pagedData.size = pageInfo.pageSize;
    this._organizationListService
      .getListOrganizations(this.pagedData)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((pagedData) => {
        this.pagedData = pagedData.data;
        this.rowsData = pagedData.data.data.map((organizationList) => ({
          ...organizationList,
        }));
        console.log("check 115")
        console.log(this.rowsData)
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
  onUpdateTable(){
    this.pagedData.size = this.sizePage[3];
    this.pagedData.currentPage = 0;
    this.setPage({ offset: 0, pageSize: this.pagedData.size });
  }
  getListTypeOrganization(){
    this._organizationListService
      .getListOrganizationCategory()
      .subscribe((res:any) => {
        
        this.typeOrganization = res.data
        console.log(this.typeOrganization)
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

      // close official table open unofficial table
      if(this.excelDataList.length > 1){
        this.openTableUpdate = true;
        this.openTable = false;
      }
      // remove item title table excel
      this.excelDataList.splice(0,1)
      this.excelDataList.map((item, index) => {
        if (item.length < 0) {
          this.excelDataList.splice(index, 1);
        }
      });
      // convert to array object
      console.log(this.excelDataList);
      // this.parentData = [];
      // var arrayList:any = [];
      this.excelDataList.map((item,index) => {
        var listOrganizations:any = {
          'organizationName':"",
          'countryOrganizationId':"",
          'subscriberCategoryId':"",
          'phoneNumber':"",
          'email':"",
          'website':"",
          'leaderName':"",
          'parentOrganizationId':"",
          "street":"",
          "country":"",
          "province":"",
          "district":"",
          "commune":"",
          "homeNumber":"",
          
        }
        item.map((value,index) =>{
          if(index === 0)  listOrganizations.organizationName = value
          if(index === 1)  listOrganizations.countryOrganizationId = value
          if(index === 2)  listOrganizations.phoneNumber = value
          if(index === 3)  listOrganizations.email = value
          if(index === 4)  listOrganizations.website = value
          if(index === 5)  listOrganizations.parentOrganizationId = value
          
        })
        
        this.parentData.push(listOrganizations);
      })
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
  toggleTable(){
    this.openTableUpdate = false;
    this.openTable = true;
  }
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
