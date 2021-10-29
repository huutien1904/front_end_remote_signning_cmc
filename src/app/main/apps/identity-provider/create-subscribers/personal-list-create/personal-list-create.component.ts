import { Component, OnInit } from '@angular/core';
import { Personal } from 'app/main/models/Personal';
import {
  ColumnMode,
  DatatableComponent,
  SelectionType,
} from "@swimlane/ngx-datatable";
import { PagedData } from 'app/main/models/PagedData';
@Component({
  selector: 'app-personal-list-create',
  templateUrl: './personal-list-create.component.html',
  styleUrls: ['./personal-list-create.component.scss']
})
export class PersonalListCreateComponent implements OnInit {

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
}
