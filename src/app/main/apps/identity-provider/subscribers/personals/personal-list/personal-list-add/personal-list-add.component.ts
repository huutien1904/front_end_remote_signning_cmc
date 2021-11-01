import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ColumnMode, SelectionType } from '@swimlane/ngx-datatable';
import { ToastrService } from "ngx-toastr";

@Component({
  selector: 'app-personal-list-add',
  templateUrl: './personal-list-add.component.html',
  styleUrls: ['./personal-list-add.component.scss']
})
export class PersonalListAddComponent implements OnInit {
  @Input() childData: any;
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

  constructor(
    private _toastrService: ToastrService,
    private modalService: NgbModal,
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
      listPersonal:""
    }
    // if(this.selected.length < 0){
    //   this._toastrService.error(
    //     "Chọn số lượng phần tử  ",   
    //     "Thành công",
    //     { toastClass: "toast ngx-toastr", closeButton: true }
    //   ) 
    // }
    dataTable.listPersonal = this.selected
    console.log(this.selected);
  }
  // listen user load page
  
  // @HostListener("window:beforeunload", ["$event"]) unloadHandler(event: Event) {
  //   let result = confirm("Changes you made may not be saved.");
  //   if (result) {
  //     // Do more processing...
  //   }
  //   event.returnValue = false; // stay on same page
  // }

  openModalEdit(modal,item) {
    this.item = item
    console.log(item);
     this.modalService.open(modal, {
      centered: true,
      size: "xl",
    });
  }
  
}
