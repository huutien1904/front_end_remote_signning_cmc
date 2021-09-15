import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import {  FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { Subject } from 'rxjs';
import { DateAdapter } from "@angular/material/core";
import { CoreConfigService } from "@core/services/config.service";
import { takeUntil } from "rxjs/operators";
import { TokenlistService } from "./tokenlist.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-token-management',
  templateUrl: './token-management.component.html',
  styleUrls: ['./token-management.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class TokenManagementComponent implements OnInit {
  minDate: Date;
  maxDate: Date;
  public rows: any[] = [];
  public moreOption = true;
  public page: number = 0;
  public pageAdvancedEllipses = 1;
  public totalPages: number;
  public sizePage: number[] = [5, 10, 15, 20];
  public formListToken: FormGroup;
  private _unsubscribeAll: Subject<any>;
  public info: any;

  constructor(
    private fb: FormBuilder,
    private _tokenService: TokenlistService,
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
    this._tokenService.getData(this.page, this.sizePage[1]).subscribe((respon:any) =>{
      this.totalPages = respon.data.totalPages * 10
      this.rows = respon.data;
    })
    this.formListToken = this.fb.group({
      tokenName: ["", Validators.required],
      sizePage: [this.sizePage[1]],
      fromDate: [null],
      toDate: [null]
    })
  }

  toggleSidebar(modalInfo, item) {
    this.info = item;
    this.modal.open(modalInfo, {size: 'md'});
  }

  changePage(e) {
    this.page = e;
    this._tokenService
      .getData(e - 1, this.formListToken.controls['sizePage'].value)
      .subscribe((res: any) => {
        this.rows = res.data;
      });
  }

  selectItem() {
    this._tokenService
      .getData(this.page, this.formListToken.controls['sizePage'].value)
      .subscribe((res: any) => {
        this.totalPages = res.data.totalPages * this.formListToken.controls['sizePage'].value;
        console.log(this.totalPages)
        this.rows = res.data.data.content;
      });
  }

  onSubmit() {
    console.log(this.formListToken);
  }

  creat() {
    this.router.navigateByUrl("/apps/equipment-management/new-token");
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}