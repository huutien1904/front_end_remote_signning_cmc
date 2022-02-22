import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
import { Organization } from 'app/main/models/Organization';
import { PagedData } from 'app/main/models/PagedData';

@Component({
  selector: 'app-service-list',
  templateUrl: './service-list.component.html',
  styleUrls: ['./service-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ServiceListComponent implements OnInit {
  public moreOption = true;
  public formServiceList: FormGroup;
  public sizePage: number[] = [5, 10, 15, 20, 50, 100];
  public selected = [];
  public flag: any;
  public pagedData = new PagedData<Organization>();
  public rowsData = new Array<Organization>();
  public chkBoxSelected = [];
  public totalItems: any = 0;
  public SelectionType = SelectionType;
  public openTable: boolean = true;
  public isLoading: boolean = false;
  @ViewChild(DatatableComponent) table: DatatableComponent;
  @ViewChild('tableRowDetails') tableRowDetails: any;
  public ColumnMode = ColumnMode;
  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    ) {}

  async ngOnInit() {
    this.formServiceList = this.fb.group({
      inputService: [null, Validators.required],
      nameService: [null, Validators.required],
      sizePage: [this.sizePage[3], Validators.required],
    });
  }
  onSubmit() {}
  selectItem(event) {}
  onInputExcel(event: any){}
  exportCSV() {}
  openNewOrganizationModal(modal) {
    this.flag = this.modalService.open(modal, {
      centered: true,
      size: 'xl',
    });
  }
}
