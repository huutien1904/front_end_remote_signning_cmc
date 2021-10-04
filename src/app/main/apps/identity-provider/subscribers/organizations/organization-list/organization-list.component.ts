import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ColumnMode, DatatableComponent,SelectionType } from '@swimlane/ngx-datatable';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Subject } from 'rxjs';
import { takeUntil } from "rxjs/operators";
import { PagedData } from "app/main/models/PagedData";
import { OrganizationListService } from './organization-list.service';
import { Organization, OrganizationCategory } from 'app/main/models/Organization';

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
  // end variable
  //private

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
      sizePage:[this.sizePage[0], Validators.required],
      typeOrganization:[null, Validators.required],
    })
    this.pagedData.size = this.sizePage[0];
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
    this.pagedData.size = this.sizePage[0];
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
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
