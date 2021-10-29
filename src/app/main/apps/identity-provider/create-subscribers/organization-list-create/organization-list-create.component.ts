import { Component, OnInit } from '@angular/core';
import { SelectionType, ColumnMode } from '@swimlane/ngx-datatable';
import { PagedData } from 'app/main/models/PagedData';
import { Personal } from 'app/main/models/Personal';

@Component({
  selector: 'app-organization-list-create',
  templateUrl: './organization-list-create.component.html',
  styleUrls: ['./organization-list-create.component.scss']
})
export class OrganizationListCreateComponent implements OnInit {

  constructor() { }
  public isLoading: boolean = false;
  public rowsData = new Array<Personal>();
  public chkBoxSelected = [];
  public selected = [];
  public SelectionType = SelectionType;
  public ColumnMode = ColumnMode;
  public pagedData = new PagedData<Personal>();
  ngOnInit(): void {
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
  onInputExcel(event){
    console.log(event)
  }
}
