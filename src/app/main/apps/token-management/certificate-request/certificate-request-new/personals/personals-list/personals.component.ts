import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { DateAdapter } from "@angular/material/core";
import { CoreConfigService } from "@core/services/config.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import {
  ColumnMode,
  DatatableComponent,
  SelectionType
} from "@swimlane/ngx-datatable";
import { PersonalService } from "app/main/apps/identity-provider/subscribers/personals/personal.service";
import { PagedData } from "app/main/models/PagedData";
import { Personal } from "app/main/models/Personal";
import { ToastrService } from "ngx-toastr";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

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
  public formListPersonal: FormGroup;
  public totalItems:any = 0;
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
   * @param _personalService
   * @param _coreSidebarService
   * @param modalService
   * @param fb
   * @param dateAdapter
   * @param _coreSidebarService
   */
  constructor(
    private _personalService: PersonalService,
    private _coreConfigService: CoreConfigService,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private modal: NgbModal,
    private dateAdapter: DateAdapter<any>,
    private toastr: ToastrService,
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
    this.formListPersonal = this.fb.group({
      page: [""],
      size: [this.sizePage[3]],
      sort: [["staffId,asc"]],
      contains: ["", Validators.required],
      gender: [null],
      dateOfBirth: [""],
      fromDate: [""],
      toDate: [""],
    });
    this.setPage({ offset: 0, pageSize: this.formListPersonal.get("size").value  });
  }



  //Set Table View
  setPage(pageInfo) {
    console.log(pageInfo);
    this.isLoading=true;
    this.formListPersonal.patchValue({"page":pageInfo.offset});
    console.log(this.formListPersonal.value)
    this._personalService
      .getListPersonals(JSON.stringify(this.formListPersonal.value))
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((pagedData) => {
        console.log(pagedData)
        this.totalItems = pagedData.data.totalItems
        this.pagedData = pagedData.data;
        this.rowsData = pagedData.data.data.map((personalList:any) => ({
          ...personalList,
          personalFirstName:
            personalList.firstName +
            " " +
            personalList.middleName +
            " " +
            personalList.lastName,
        }));
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
    console.log(this.selected)
  }
  createCertificateRequest(modalForm){
    if(this.selected.length > 0){
      this.toggleSidebar(modalForm,this.selected[0])
    }else{
      this.toastr.warning(
        '👋 Bạn cần chọn thuê bao cá nhân trước',
         'Cảnh báo',
        {
          positionClass: 'toast-top-center',
          toastClass: 'toast ngx-toastr',
          closeButton: true,
        }
      );
    }
    
  }
  toggleSidebar(modalForm, item) {
    this.item = item;
    console.log(item);
    this.modal.open(modalForm, {size: 'xl'})
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
