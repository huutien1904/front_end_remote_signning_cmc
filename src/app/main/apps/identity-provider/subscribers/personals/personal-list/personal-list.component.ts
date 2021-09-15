import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { DateAdapter } from "@angular/material/core";
import { CoreSidebarService } from "@core/components/core-sidebar/core-sidebar.service";
import { CoreConfigService } from "@core/services/config.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { PersonalListService } from "./personal-list.service";

@Component({
  selector: "app-personal-list",
  templateUrl: "./personal-list.component.html",
  styleUrls: ["./personal-list.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class PersonalListComponent implements OnInit {
  minDate: Date;
  maxDate: Date;
  public rows;
  public moreOption = true;
  public page: number = 0;
  public pageAdvancedEllipses = 1;
  public totalPages: number;
  public sizePage: number[] = [5, 10, 15, 20];
  gender: string[] = ["Nam", "Nữ"];
  // Private
  private _unsubscribeAll: Subject<any>;
  public formListPersonal: FormGroup;

  /**
   *
   * @param _userListService
   * @param _coreSidebarService
   * @param _coreConfigService
   * @param modalService
   * @param fb
   * @param dateAdapter
   */
  constructor(
    private _userListService: PersonalListService,
    private _coreSidebarService: CoreSidebarService,
    private _coreConfigService: CoreConfigService,
    private modalService: NgbModal,
    private fb: FormBuilder,
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

  /**
   * On init
   */
  ngOnInit(): void {
    this.formListPersonal = this.fb.group({
      inputPersonal: [null, Validators.required],
      fromDate: [null],
      toDate: [null],
      sizePage: [this.sizePage[1]],
      gender: [],
      birthday: [],
    });
    this._userListService
      .getData(this.page, this.sizePage[1])
      .subscribe((res: any) => {
        this.totalPages = res.data.totalPages * 10;
        this.rows = res.data.data;
      });
  }

  // Public Methods

  toggleModal() {
    this.modalService.hasOpenModals();
  }
  openNewPersonalModal(modal) {
    this.modalService.open(modal, {
      centered: true,
      size: "xl",
    });
  }

  closeModal(name) {
    this._coreSidebarService.getSidebarRegistry(name).toggleOpen();
  }

  changePage(e) {
    this.page = e;
    this._userListService
      .getData(e - 1, this.formListPersonal.get["sizePage"].value)
      .subscribe((res: any) => {
        this.rows = res.data.data;
      });
  }

  selectItem() {
    this._userListService
      .getData(this.page, this.formListPersonal.get["sizePage"].value)
      .subscribe((res: any) => {
        this.totalPages = res.data.totalPages * 10;
        this.rows = res.data.data;
      });
  }

  updateTable() {
    this._userListService
      .getData(this.page, this.formListPersonal.get["sizePage"].value)
      .subscribe((res: any) => {
        this.rows = res.data.data;
      });
  }

  onSubmit() {
    console.log(this.formListPersonal);
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
