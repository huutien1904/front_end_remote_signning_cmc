import { Component, EventEmitter, HostListener, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ColumnMode, SelectionType,DatatableComponent } from '@swimlane/ngx-datatable';
import { Console } from 'console';
import { ToastrService } from "ngx-toastr";
import { PersonalListService } from '../personal-list.service';

@Component({
  selector: 'app-personal-list-add',
  templateUrl: './personal-list-add.component.html',
  styleUrls: ['./personal-list-add.component.scss']
})
export class PersonalListAddComponent implements OnInit {
  @Input() childData: any;
  @ViewChild(DatatableComponent) table: DatatableComponent;
  @Output() toggleTable = new EventEmitter();
  public chkBoxSelected = [];
  public selected:any = [];
  public SelectionType = SelectionType;
  public ColumnMode = ColumnMode;
  public pagedData:any[] = [];
  public isLoading: boolean = false;
  public editingName = {};
  public editingPersonalId = {};
  public editingBirthday = {};
  public editingGender = {};
  public editingEmail = {};
  public item: any;
  public rowIndex:any
  constructor(
    private _toastrService: ToastrService,
    private modalService: NgbModal,
    private router: Router,
    private _personalListService: PersonalListService, 
    ) {}

  ngOnInit(): void {
    console.log(this.childData)
  }

  customCheckboxOnSelect({ selected }) {
    this.chkBoxSelected.splice(0, this.chkBoxSelected.length);
    this.chkBoxSelected.push(...selected);
  }
  onSelect({ selected }) {
    console.log("Select Event", selected, this.selected);
    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
  }
  inlineEditingUpdateName(event, cell, rowIndex) {
    this.editingName[rowIndex + '-' + cell] = false;
    this.childData[rowIndex][cell] = event.target.value;
    this.childData = [...this.childData];
  }
  inlineEditingUpdatePersonalId(event, cell, rowIndex) {
    this.editingPersonalId[rowIndex + '-' + cell] = false;
    this.childData[rowIndex][cell] = event.target.value;
    this.childData = [...this.childData];
  }
  inlineEditingUpdateBirthday(event, cell, rowIndex) {
    this.editingBirthday[rowIndex + '-' + cell] = false;
    this.childData[rowIndex][cell] = event.target.value;
    this.childData = [...this.childData];
  }
  inlineEditingUpdateGender(event, cell, rowIndex) {
    this.editingGender[rowIndex + '-' + cell] = false;
    this.childData[rowIndex][cell] = event.target.value;
    this.childData = [...this.childData];
  }
  inlineEditingUpdateEmail(event, cell, rowIndex) {
    this.editingEmail[rowIndex + '-' + cell] = false;
    this.childData[rowIndex][cell] = event.target.value;
    this.childData = [...this.childData];
  }
  updateTable(){
    var dataTable = {
      "staffList":[

      ],
      "organizationId": 1,
      "subscriberCategoryId": 3
    }
    
    if(this.selected.length === 0){
      console.log("chua chon phan tu");
      this._toastrService.success(
        "Chọn số lượng phần tử  ",   
        "Thất bại",
        { toastClass: "toast ngx-toastr", closeButton: true }
      ) 
    }
    if(this.selected.length > 0){
      JSON.stringify(this.selected)
      dataTable.staffList = this.selected
      JSON.stringify(dataTable)
      console.log("selector",dataTable);
      this._personalListService
      .createListPersonal(dataTable)
      .subscribe((res) =>{
        console.log(res);
      })
      // this.toggleTable.emit();
      this.router.navigate(['/apps/ip/subscribers-list']);
    }
    
  }
  // listen user load page
  
  // @HostListener("window:beforeunload", ["$event"]) unloadHandler(event: Event) {
  //   let result = confirm("Changes you made may not be saved.");
  //   if (result) {
  //     // Do more processing...
  //   }
  //   event.returnValue = false; // stay on same page
  // }

  openModalEdit(modal,item,rowIndex) {
    this.item = item
    console.log(item);
    this.rowIndex = rowIndex
    this.modalService.open(modal, {
    centered: true,
    size: "xl",
    });
  }
  getEditPersonal(personal){
    this.childData[this.rowIndex] = personal
    this.childData =[...this.childData]
    console.log(this.childData);
  }
  
}
