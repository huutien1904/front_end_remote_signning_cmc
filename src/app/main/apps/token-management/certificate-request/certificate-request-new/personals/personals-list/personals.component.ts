import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import {  FormBuilder, FormGroup, Validators } from "@angular/forms";
import { CoreConfigService } from "@core/services/config.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { PersonalListService } from "app/main/apps/identity-provider/subscribers/personals/personal-list/personal-list.service";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { DateAdapter } from "@angular/material/core";

@Component({
  selector: 'app-personals',
  templateUrl: './personals.component.html',
  styleUrls: ['./personals.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PersonalsComponent implements OnInit {
  minDate: Date;
  maxDate: Date;
  public rows: any[] = [];
  public moreOption = true;
  public page: number = 0;
  public pageAdvancedEllipses = 1;
  public totalPages: number;
  public sizePage: number[] = [5, 10, 15, 20];
  gender: string[] = ["Nam", "Nữ"];
  public searchValue = '';
  public item: any;
  private _unsubscribeAll: Subject<any>;
  public formListCertificateRequest: FormGroup;


  /**
   *
   * @param _userListService
   * @param _coreSidebarService
   * @param modalService
   * @param fb
   * @param dateAdapter
   */
  constructor(
    private _userListService: PersonalListService,
    private _coreConfigService: CoreConfigService,
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

  toggleSidebar(modalForm, item) {
    this.item = item;
    this.modal.open(modalForm, {size: 'lg'})
  }

  changePage(e) {
    console.log(typeof e);
    this.page = e;
    this._userListService
      .getData(e - 1, this.formListCertificateRequest.controls.sizePage.value)
      .subscribe((res: any) => {
        this.rows = res.data.data;
      });
  }

  selectItem() {
    this._userListService
      .getData(this.page, this.formListCertificateRequest.controls.sizePage.value)
      .subscribe((res: any) => {
        this.totalPages = res.data.totalPages * this.formListCertificateRequest.controls.sizePage.value;
        this.rows = res.data.data;
      });
  }

  onSubmit() {
    console.log(this.formListCertificateRequest);
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
