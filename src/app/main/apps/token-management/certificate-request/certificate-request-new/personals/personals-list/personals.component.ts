import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { CoreConfigService } from "@core/services/config.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { PersonalListService } from "app/main/apps/identity-provider/subscribers/personals/personal-list/personal-list.service";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { DateAdapter } from "@angular/material/core";
import {
  ColumnMode,
  DatatableComponent,
  SelectionType,
} from "@swimlane/ngx-datatable";
import { PagedData } from "app/main/models/PagedData";
import { Personal } from "app/main/models/Personal";
import { threadId } from "worker_threads";

@Component({
  selector: "app-personals",
  templateUrl: "./personals.component.html",
  styleUrls: ["./personals.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class PersonalsComponent implements OnInit {
  minDate: Date;
  maxDate: Date;
  public rowsData = new Array<Personal>();
  private _unsubscribeAll: Subject<any>;
  public formListCertificateRequest: FormGroup;
  public item: any;
  //page setup
  @ViewChild(DatatableComponent) table: DatatableComponent;
  @ViewChild("tableRowDetails") tableRowDetails: any;

  public isLoading: boolean = false;
  public ColumnMode = ColumnMode;
  public moreOption = true;
  public sizePage: number[] = [5, 10, 15, 20, 50, 100];
  gender: string[] = ["Nam", "Nữ"];
  public pagedData = new PagedData<Personal>();
  public chkBoxSelected = [];
  public selected = [];
  public SelectionType = SelectionType;
  public rowDataSelected = [];
  /**
   *
   * @param _userListService
   * @param _coreSidebarService
   * @param modalService
   * @param fb
   * @param dateAdapter
   * @param _coreSidebarService
   */
  constructor(
    private _userListService: PersonalListService,
    private _coreConfigService: CoreConfigService,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private modal: NgbModal,
    private dateAdapter: DateAdapter<any>
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

  ngOnInit(): void {
    this.formListCertificateRequest = this.fb.group({
      inputPersonal: [null, Validators.required],
      fromDate: [null],
      toDate: [null],
      sizePage: [this.sizePage[3]],
      gender: [],
      birthday: [],
    });
    this.pagedData.size = this.sizePage[3];
    this.pagedData.currentPage = 0;
    this.setPage({ offset: 0, pageSize: this.pagedData.size });
  }

  changePage() {
    this.pagedData.size = this.formListCertificateRequest.get("sizePage").value;
    this.setPage({ offset: 0, pageSize: this.pagedData.size });
  }

  setPage(pageInfo) {
    console.log(pageInfo);
    this.isLoading = true;
    this.pagedData.currentPage = pageInfo.offset;
    this.pagedData.size = pageInfo.pageSize;
    this._userListService
      .getListPersonals(this.pagedData)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((pagedData) => {
        console.log(pagedData);
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
        this.isLoading = false;
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

  toggleSidebar(modalForm, item) {
    this.item = item;
    console.log(item);
    this.modal.open(modalForm, { size: "lg" });
  }

  onSubmit() {
    console.log(this.formListCertificateRequest);
  }

  openNewSelectModal(modal) {
    this.rowDataSelected = this.selected;
    this.modalService.open(modal, {
      centered: true,
      size: "xl",
    });
  }

  acceptSelected(modal){
    modal.close('Accept click');
    alert('Gửi yêu cầu chứng thực thành công');
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
