import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import {  FormBuilder, FormGroup, Validators } from "@angular/forms";
import { HsmListService } from "./hsm-list.service";
import { Subject } from 'rxjs';
import { DateAdapter } from "@angular/material/core";
import { CoreConfigService } from "@core/services/config.service";
import { takeUntil } from "rxjs/operators";
import { Router } from '@angular/router';
import { Hsm } from "app/main/models/Equipment";
import { SelectionType, DatatableComponent, ColumnMode } from "@swimlane/ngx-datatable";
@Component({
  selector: 'app-hsm-management',
  templateUrl: './hsm-management.component.html',
  styleUrls: ['./hsm-management.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HsmManagementComponent implements OnInit {
  minDate: Date;
  maxDate: Date;
  public rows: Hsm[] = [];
  public moreOption = true;
  public formListHsm: FormGroup
  private _unsubscribeAll: Subject<any>;

  //page setup
  @ViewChild(DatatableComponent) table: DatatableComponent;
  @ViewChild("tableRowDetails") tableRowDetails: any;
  public isLoading: boolean = false;
  public ColumnMode = ColumnMode;
  public page: number = 0;
  public totalPages: number = 0;
  public sizePage: number[] = [5, 10, 15, 20, 50, 100];
  public chkBoxSelected = [];
  public selected = [];
  public SelectionType = SelectionType;

  constructor(
    private fb: FormBuilder,
    private _hsmService: HsmListService,
    private _coreConfigService: CoreConfigService,
    private dateAdapter: DateAdapter<any>,
    private router: Router,
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
    this._hsmService.getData(this.page, this.sizePage[3]).subscribe((respon:any) =>{
      this.totalPages = respon.data.length;
      this.rows = respon.data;
    })
    this.formListHsm = this.fb.group({
      hsmName: ["", Validators.required],
      sizePage: [this.sizePage[3]],
      fromDate: [null],
      toDate: [null]
    })
  }
  changePage(e) {
    this.page = e;
    this._hsmService
      .getData(e - 1, this.formListHsm.controls['sizePage'].value)
      .subscribe((res: any) => {
        this.rows = res.data;
      });
  }

  selectItem() {
    this._hsmService
      .getData(this.page, this.formListHsm.controls['sizePage'].value)
      .subscribe((res: any) => {
        //this.totalPages = res.data.totalPages * this.formListHsm.controls['sizePage'].value;
        console.log(this.totalPages)
        this.rows = res.data.data.content;
      });
  }

  onSubmit() {
    console.log(this.formListHsm);
  }

  creat() {
    this.router.navigateByUrl("/apps/equipment-management/new-hsm")
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

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
