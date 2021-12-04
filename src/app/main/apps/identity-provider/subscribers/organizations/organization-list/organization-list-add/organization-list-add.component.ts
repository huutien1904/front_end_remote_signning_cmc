import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SelectionType, ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-organization-list-add',
  templateUrl: './organization-list-add.component.html',
  styleUrls: ['./organization-list-add.component.scss']
})
export class OrganizationListAddComponent implements OnInit {
  @Input() childData: any;
  @ViewChild(DatatableComponent) table: DatatableComponent;
  @Output() toggleTable = new EventEmitter();
  public chkBoxSelected = [];
  public selected:any = [];
  public SelectionType = SelectionType;
  public ColumnMode = ColumnMode;
  public pagedData:any[] = [];
  public isLoading: boolean = false;
  public item: any;
  public rowIndex:any
  constructor(
    private _toastrService: ToastrService,
    private modalService: NgbModal,
  ) { 
  }

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
  openModalEdit(modal,item,rowIndex) {
    this.item = item
    console.log(item);
    this.rowIndex = rowIndex
    this.modalService.open(modal, {
    centered: true,
    size: "xl",
    });
  }
  getEditOrganization(organization){
    this.childData[this.rowIndex] = organization
    this.childData =[...this.childData]
    console.log(this.childData);
  }
  updateTable(){
    var dataTable = {
      listPersonal:""
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
      dataTable.listPersonal = this.selected
      console.log("selector",this.selected.length);
      this.toggleTable.emit();
    }
    
  }
}
