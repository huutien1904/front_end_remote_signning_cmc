import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ColumnMode, DatatableComponent, } from '@swimlane/ngx-datatable';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Subject } from 'rxjs';

import { OrganizationListService } from './organization-list.service';
@Component({
  selector: 'app-organization-list',
  templateUrl: './organization-list.component.html',
  styleUrls: ['./organization-list.component.scss'],
  encapsulation: ViewEncapsulation.None

})
export class OrganizationListComponent implements OnInit {
  // variable
  public typeOrganization:any[] = [
    "CÁ NHÂN",
    "TẬP ĐOÀN",
    "DOANH NGHIỆP"
  ]
  public moreOption = true
  formListOrganizations: FormGroup;
  public sizePage = [5,10,15,20]
  public rows;
  // end

  //function
  
  onSubmit(){

  }
  selectItem(event){

  }
  // end

  // Decorator
  @ViewChild(DatatableComponent) table: DatatableComponent;

  private _unsubscribeAll: Subject<any>;

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
    this.modalService.open(modal, {
      centered:true,
      size:'xl'
    });
  }
  toggleModal(){
    this.modalService.dismissAll();
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
    })
    this.rows = this._organizationListService.createDb().heroes
  }
  

}
