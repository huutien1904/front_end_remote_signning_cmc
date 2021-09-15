import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import {  FormBuilder, FormGroup, Validators } from "@angular/forms";
import { HsmlistService } from "./hsmlist.service";
import { Subject } from 'rxjs';
import { DateAdapter } from "@angular/material/core";
import { CoreConfigService } from "@core/services/config.service";
import { takeUntil } from "rxjs/operators";
import { Router } from '@angular/router';
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Hsm } from "app/main/models/Equipment";
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
  public page: number = 0;
  public pageAdvancedEllipses = 1;
  public totalPages: number;
  public sizePage: number[] = [5, 10, 15, 20];
  public formListHsm: FormGroup
  private _unsubscribeAll: Subject<any>;
  public info: any;
  public list: any[] = [];

  constructor(
    private fb: FormBuilder,
    private _hsmService: HsmlistService,
    private _coreConfigService: CoreConfigService,
    private dateAdapter: DateAdapter<any>,
    private router: Router,
    private modal: NgbModal,
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
    this._hsmService.getData(this.page, this.sizePage[1]).subscribe((respon:any) =>{
      this.totalPages = respon.data.totalPages * 10
      this.rows = respon.data;
    })
    this.formListHsm = this.fb.group({
      hsmName: ["", Validators.required],
      sizePage: [this.sizePage[1]],
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
        this.totalPages = res.data.totalPages * this.formListHsm.controls['sizePage'].value;
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

  toggleSidebar(modalInfo, item) {
    this.info = item
    this._hsmService.getHsmDetail(item.hsmId).subscribe((res: any) => {
      this.list = res.data;
    })
    this.modal.open(modalInfo, {size: 'lg'})
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
