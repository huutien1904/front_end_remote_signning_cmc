import { Token } from '@angular/compiler';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
import { MechanismInfo } from 'app/main/models/Equipment';
import { PagedData } from 'app/main/models/PagedData';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { takeUntil, map } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { HsmService } from '../../hsm-management/hsm.service';
import { TokenService } from '../token.service';

@Component({
  selector: 'app-token-view',
  templateUrl: './token-view.component.html',
  styleUrls: ['./token-view.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TokenViewComponent implements OnInit {
  [x: string]: any;
  // public 
  public url = this.router.url;
  public lastValue;
  private _unsubscribeAll = new Subject();
  public tokenForm: FormGroup;
  public contentHeader: object;
  public submitted = false;
  public hsmList: any[];
  public slotOption: any[] = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']
  public body = {
    "page" : null,
    "size" : 4,
    "sort" : ["hsmId,asc"],
    "contains" : "",
    "fromDate" : "",
    "toDate" : ""
  }
  public HSMname = ""
  // public data table
  public  ColumnMode = ColumnMode;
  @ViewChild(DatatableComponent) table: DatatableComponent;
  @ViewChild('tableRowDetails') tableRowDetails: any;
  public pagedData = new PagedData<Token>();
  public isLoading: boolean = false;
  public page: number = 0;
  public totalPages: number = 0;
  public sizePage: number[] = [5, 10, 15, 20, 50, 100];
  public SelectionType = SelectionType;
  public totalItems: any = 0;
  public selected: any[] = [];
  public mechanismList :Array<MechanismInfo> = null;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private _tokenService: TokenService,
    private _hsmService: HsmService,
    private   toastr: ToastrService
  ) { }

  ngOnInit() {
    this.tokenForm = this.formBuilder.group(
      { 
        tokenId : [null, Validators.required],
        slotNumber: [null, Validators.required],
        tokenName: [null, Validators.required],
        tokenPassword: ['', Validators.required],
        hsmInformationId: ["", Validators.required],
        hsmName:["", Validators.required],
      },
      
    );
    this.getHsmList();
    this.contentHeader = {
      headerTitle: 'Chi tiết Slot',
      actionButton: true,
      breadcrumb: {
        type: 'chevron',
        links: [
          {
            name: 'Danh sách Slot',
            isLink: true,
            link: '/apps/equipment-management/token/token-list'

          },
          {
            name: 'Chi tiết',
            isLink: false,
          }
        ]
      }
    };

    this._unsubscribeAll = new Subject();
    this.lastValue = this.url.substr(this.url.lastIndexOf('/') + 1);
    this._tokenService.getTokenId(this.lastValue)
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe((res) => {
      console.log(res);
      
      this.tokenForm.patchValue({
        slotNumber: res.data.slotNumber,
        tokenName: res.data.tokenName,
        tokenId: res.data.tokenId,
        hsmName : res.data.hsmName,
        hsmId : res.data.hsmId,
      });
      this.mechanismList = res.data.mechanismDtoList;
    });
    this.pagedData.totalItems = 5;
  }

  rowDetailsToggleExpand(row) {
    this.tableRowDetails.rowDetail.toggleExpandRow(row);
  }
  
  // function
  getHsmList() {
   
    this._hsmService.getListHsm(this.body)
      .pipe(
        map(response => {
          console.log(response)
          const data = response.data.data.map(hsmId => ({
            ...hsmId
          }))
          return data;
        }),
        takeUntil(this._unsubscribeAll)
      )
      .subscribe(response => {
        this.hsmList = response;
        console.log(this.hsmList);
      });
  }

  exit() {
    this.router.navigateByUrl("/apps/equipment-management/token/token-list")
  }
  get f() {
    return this.tokenForm.controls;
  }
  

}
