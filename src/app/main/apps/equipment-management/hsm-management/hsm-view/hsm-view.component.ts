import { FormArray } from '@angular/forms';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { HsmService } from '../hsm.service';
import { Token } from 'app/main/models/Equipment';
import { PagedData } from 'app/main/models/PagedData';
import {
  ColumnMode,
  DatatableComponent,
  SelectionType,
} from '@swimlane/ngx-datatable';
import { TokenService } from '../../token-management/token.service';
@Component({
  selector: 'app-hsm-view',
  templateUrl: './hsm-view.component.html',
  styleUrls: ['./hsm-view.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class HsmViewComponent implements OnInit {
  public isLoading: boolean = false;
  public rowsData:any = new Array<Token>();
  public pagedData = new PagedData<Token>();
  private _unsubscribeAll: Subject<any>;
  public url = this.router.url;
  public HsmFormView: FormGroup;
  public HSMname: string;
  public lastValue;
  public contentHeader: object;
  public submitted = false;
  public hsmType: any[] = ['NET', 'PCI'];
  public hsmForm: any[] = ['FIPS', 'PC5'];
  public ColumnMode = ColumnMode;
  public showConnect:boolean = true
  public totalItems
  tokens: any[] = [];
  public formListToken: FormGroup;
  hsmTokenList;
  get f() {
    return this.HsmFormView.controls;
  }

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private _hsmService: HsmService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private _tokenService: TokenService,
  ) {
    this._unsubscribeAll = new Subject();
    this.lastValue = this.url.substr(this.url.lastIndexOf('/') + 1);
    if(this.lastValue % 2 == 0){
      this.showConnect = false
    }
    console.log(this.lastValue);
    this.HsmFormView = this.formBuilder.group({
      hsmName: [null, Validators.required],
      hardwareId: [null, Validators.required],
      hsmManufacturer: [null, Validators.required],
      hsmModel: [null, Validators.required],
      hsmLibraryPath: [
        '/opt/utimaco/PKCS11_R2/lib/libcs_pkcs11_R2.so',
        Validators.required,
      ],
      hsmType: [null, Validators.required],
      hsmForm: ['FIPS', Validators.required],
      hsmTokenList: new FormArray([], Validators.required),
    });

  }
  setPage(pageInfo) {
    this.isLoading = true;
  }
  ngOnInit() {
    this.contentHeader = {
      headerTitle: 'Tạo kết nối HSM',
      actionButton: true,
      breadcrumb: {
        type: 'chevron',
        links: [
          {
            name: 'Danh sách kết nối bị HSM',
            isLink: true,
            link: '/apps/equipment-management/hsm/hsm-list',
          },
          {
            name: 'Chi tiết kết nối HSM',
            isLink: false,
            // link: '/apps/equipment-management/new-hsm'
          },
        ],
      },
    };
    this.formListToken = this.fb.group({
      page: [null],
      size: [null],
      sort: [null],
      contains: [''],
      fromDate: [""],
      toDate: [""],
    });
    console.log(this.HsmFormView.value);
    this._tokenService
    .getListToken(JSON.stringify(this.formListToken.value))
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe((pagedData) => {
      console.log(pagedData.data);
      this.totalItems = pagedData.data.totalItems;
      this.pagedData = pagedData.data;
      this.rowsData = pagedData.data.data.map((item,index) =>({
        ...item,
        passwordSO:"Đã Khởi tạo",
        passwordUser:"Đã khởi tạo",
        privateKey: 10,
        secretKey:100
      }));
      this.isLoading = false;
    });
  }
  exit() {
    this.router.navigateByUrl('/apps/equipment-management/hsm/hsm-list');
  }
}
