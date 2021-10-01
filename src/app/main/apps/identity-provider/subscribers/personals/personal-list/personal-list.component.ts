import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { DateAdapter } from "@angular/material/core";
import { CoreSidebarService } from "@core/components/core-sidebar/core-sidebar.service";
import { CoreConfigService } from "@core/services/config.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import {
  ColumnMode,
  DatatableComponent,
  SelectionType,
} from "@swimlane/ngx-datatable";
import { PagedData } from "app/main/models/PagedData";
import { Personal } from "app/main/models/Personal";
import { ifError } from "assert";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { PersonalListService } from "./personal-list.service";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-personal-list",
  templateUrl: "./personal-list.component.html",
  styleUrls: ["./personal-list.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class PersonalListComponent implements OnInit {
  minDate: Date;
  maxDate: Date;
  //Table of personal data
  public pagedData = new PagedData<Personal>();
  public rowsData = new Array<Personal>();
  public chkBoxSelected = [];
  public selected = [];
  public SelectionType = SelectionType;
  @ViewChild(DatatableComponent) table: DatatableComponent;
  @ViewChild("tableRowDetails") tableRowDetails: any;
  public isLoading: boolean = false;
  public ColumnMode = ColumnMode;
  public moreOption = true;
  public flag:any;
  public sizePage: number[] = [5, 10, 15, 20, 50, 100];
  gender: string[] = ["Nam", "Nữ"];
  // Private
  private _unsubscribeAll: Subject<any>;
  public formListPersonal: FormGroup;

  /**
   *
   * @param _personalListService
   * @param _coreSidebarService
   * @param _coreConfigService
   * @param modalService
   * @param fb
   * @param dateAdapter
   * @param dateAdapter
   */
  constructor(
    private _personalListService: PersonalListService,
    private _coreSidebarService: CoreSidebarService,
    private _coreConfigService: CoreConfigService,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private dateAdapter: DateAdapter<any>,
    private _toastrService: ToastrService,
  ) {
    this._unsubscribeAll = new Subject();
    const currentYear = new Date().getFullYear();
    this.minDate = new Date(currentYear - 4, 0, 1);
    this.maxDate = new Date(currentYear + 2, 11, 31);
    this._coreConfigService.config
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((config) => {
        this.dateAdapter.setLocale(config.app.appLanguage);
      });
  }

  /**
   * On init
   */
  ngOnInit(): void {
    this.formListPersonal = this.fb.group({
      inputPersonal: [null, Validators.required],
      fromDate: [null],
      toDate: [null],
      sizePage: [this.sizePage[0]],
      gender: [],
      birthday: [],
    });
    this.pagedData.size = this.sizePage[0];
    this.pagedData.currentPage = 0;
    this.setPage({ offset: 0, pageSize: this.pagedData.size });
  }
  changePage() {
    this.pagedData.size = this.formListPersonal.get("sizePage").value;
    this.setPage({ offset: 0, pageSize: this.pagedData.size });
  }

  //Set Table View
  setPage(pageInfo) {
    console.log(pageInfo);
    this.isLoading=true;
    this.pagedData.currentPage = pageInfo.offset;
    this.pagedData.size = pageInfo.pageSize;
    this._personalListService
      .getListPersonals(this.pagedData)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((pagedData) => {
        this.pagedData = pagedData.data;
        this.rowsData = pagedData.data.data.map((personalList) => ({
          ...personalList,
          personalFirstName:
            personalList.personalFirstName +
            " " +
            personalList.personalMiddleName +
            " " +
            personalList.personalLastName,
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
  // Public Methods
  openNewPersonalModal(modal) {
    this.flag = this.modalService.open(modal, {
      centered: true,
      size: "xl",
    });
    console.log(this.flag)
  }

  closeModal(name) {
    this.modalService.dismissAll();
  }

  onSubmit() {
    console.log(this.formListPersonal);
  }
  updateTable(){
    this.pagedData.size = this.sizePage[0];
    this.pagedData.currentPage = 0;
    this.setPage({ offset: 0, pageSize: this.pagedData.size });
  }
  deletePersonal(personalID){
    this._personalListService
        .deletePersonal(personalID)
        .subscribe((res) =>{
          const result = res
            this.updateTable();
            this._toastrService.success(
              "Xóa Thuê Bao cá nhân thành công ",   
              "Thành công",
              { toastClass: "toast ngx-toastr", closeButton: true }
            )
        })
  }
  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
