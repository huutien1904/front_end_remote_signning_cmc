import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ColumnMode, SelectionType } from '@swimlane/ngx-datatable';

@Component({
  selector: 'app-personal-list-add',
  templateUrl: './personal-list-add.component.html',
  styleUrls: ['./personal-list-add.component.scss']
})
export class PersonalListAddComponent implements OnInit {
  @Input() childData: any;
  public chkBoxSelected = [];
  public selected = [];
  public SelectionType = SelectionType;
  public ColumnMode = ColumnMode;
  public pagedData:any[] = [];
  public isLoading: boolean = false;
  public editingName = {};
  public editingCCCD = {};
  public editingBirthday = {};
  public editingGender = {};

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
  constructor() { }

  ngOnInit(): void {
    console.log(this.childData)
  }

}
