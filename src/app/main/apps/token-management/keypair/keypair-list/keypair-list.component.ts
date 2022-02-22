import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CoreConfigService } from '@core/services/config.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PersonalService } from 'app/main/apps/identity-provider/subscribers/personals/personal.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DateAdapter } from '@angular/material/core';
import {
  ColumnMode,
  DatatableComponent,
  SelectionType,
} from '@swimlane/ngx-datatable';
import { PagedData } from 'app/main/models/PagedData';
import { Personal } from 'app/main/models/Personal';
import { KeypairListService } from './keypair-list.service';
import { Keypair } from 'app/main/models/Keypair';
import { Router } from '@angular/router';
import { HsmService } from 'app/main/apps/equipment-management/hsm-management/hsm.service';

@Component({
  selector: 'app-keypair-list',
  templateUrl: './keypair-list.component.html',
  styleUrls: ['./keypair-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class KeypairListComponent implements OnInit {
  minDate: Date;
  maxDate: Date;
  private _unsubscribeAll: Subject<any>;
  public formListPersonal: FormGroup;
  public formListPersonals: FormGroup;
  public formListKeypair: FormGroup;
  public item: any;
  public contentHeader: object;
  //page setup
  @ViewChild(DatatableComponent) table: DatatableComponent;
  @ViewChild('tableRowDetails') tableRowDetails: any;
  public isLoading: boolean = false;
  public ColumnMode = ColumnMode;
  public moreOption = true;
  public sizePage: number[] = [5, 10, 15, 20, 50, 100];
  gender: string[] = ['Nam', 'Nữ'];
  public pagedData = new PagedData<Keypair>();
  public rowsData = new Array<Keypair>();
  public hsmList: any[] = [];
  public tokenName: any;
  public tokenList: any[] = [];
  public hsmName: any[] = [];
  public keypairList: any[] = ['Kết nối HSM', 'Slot'];
  public cryptoAlgorithm = [
    {
      cryptoSystem: 'RSA',
      keypairLength: ['1024', '1536', '2048', '3072', '4096', '6144', '8192'],
    },
    {
      cryptoSystem: 'ECDSA',
      keypairLength: ['secp256r1', 'secp384r1', 'secp521r1'],
    },
  ];
  public keypairLengthList = this.cryptoAlgorithm[0].keypairLength;
  public keypairStatusName: any[] = ['Đã chứng thực', 'Hết hạn', 'Gia hạn'];

  public chkBoxSelected = [];
  public selected = [];
  public SelectionType = SelectionType;

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
    private _keypairService: KeypairListService,
    private fb: FormBuilder,
    private _personalService: PersonalService,
    private _coreConfigService: CoreConfigService,
    private modal: NgbModal,
    private dateAdapter: DateAdapter<any>,
    private _hsmService: HsmService,
    private _router: Router
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
    this.formListKeypair = this.fb.group({
      aliasKeypair: [null, Validators.required],
      cryptoSystem: [null, Validators.required],
      keypairLength: [null, Validators.required],
      fromDate: [null],
      toDate: [null],
      sizePage: [this.sizePage[3]],
    });
    this._hsmService
      .getListHsm({
        page: 0,
        size: 100,
      })
      .toPromise()
      .then((hsmList) => {
        console.log(hsmList);
        this.hsmList = hsmList.data.data;
        this.hsmName = this.hsmList[0].hsmName;
        this.tokenList = this.hsmList[0].tokens;
        this.tokenName = this.hsmList[0].tokens[0].tokenName;
        console.log(this.hsmList);
        console.log(this.tokenList);
      });
    this.formListPersonal = this.fb.group({
      page: 0,
      size: [this.sizePage[3]],
      sort: [null],
      contains: [null, Validators.required],
      fromDate: [null],
      toDate: [null],
      keypairList: [this.keypairList[0], Validators.required],
      keypairName: [null, Validators.required],
      keypairStatusName: [null, Validators.required],
      cryptoAlgorithm: this.fb.group({
        cryptoSystem: [this.cryptoAlgorithm[0], Validators.required],
        keypairLength: [this.keypairLengthList[0], Validators.required],
      }),
    });
    this.pagedData.size = this.sizePage[3];
    // this.pagedData.currentPage = 0;
    this.setPage({
      offset: 0,
      pageSize: this.formListPersonal.get('size').value,
    });
    this.contentHeader = {
      headerTitle: 'Cặp khóa',
      actionButton: true,
      breadcrumb: {
        type: 'chevron',
        links: [
          {
            name: 'Danh sách cặp khóa',
            isLink: false,
            link: '/apps/tm/keypair/keypair-list',
          },
        ],
      },
    };
  }

  changeCrypto() {
    this.keypairLengthList = this.formListPersonal
      .get('cryptoAlgorithm')
      .get('cryptoSystem').value.keypairLength;
    this.formListPersonal
      .get('cryptoAlgorithm')
      .patchValue({ keypairLength: this.keypairLengthList[0] });
  }
  setPage(pageInfo) {
    this.rowsData = [];
    console.log("check");
    console.log(pageInfo);
    this.isLoading=true;
    // this.formListPersonal.patchValue({"page":pageInfo.offset}); 
    // console.log(JSON.stringify(this.formListPersonals.value));
    // console.log(this.formListPersonals.value);

    const body = {
      page: null,
      size: pageInfo.pageSize,
      sort: this.formListPersonal.value.sort,
      contains: null,
      fromDate: this.formListPersonal.value.fromDate,
      toDate: this.formListPersonal.value.toDate,
    };
    console.log(body);
    this._keypairService
      .getData(body)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((pagedData) => {
        console.log(pagedData);
        this.pagedData = pagedData.data;
        this.rowsData = pagedData.data.data;
        console.log(this.rowsData);
        // ng
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
  onActivate(event) {
    if (
      event.type === 'click' &&
      event.column.name != 'Hành động' &&
      event.column.name != 'checkbox'
    ) {
      console.log(event.row);
      this._router.navigate([
        '/apps/tm/keypair/keypair-view/',
        event.row.keypairId,
      ]);
    }
  }
  onSelect({ selected }) {
    console.log('Select Event', selected, this.selected);
    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
  }

  toggleSidebar(modalForm, item) {
    this.item = item;
    console.log(item);
    this.modal.open(modalForm, { size: 'xl' });
  }

  onSubmit() {
    console.log(this.formListPersonal.value);
    this._keypairService
      .getData(JSON.stringify(this.formListPersonal.value))
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((pagedData) => {
        console.log(pagedData);
        this.pagedData = pagedData.data;
        this.rowsData = pagedData.data.data;
        console.log(this.rowsData);
        this.rowsData = pagedData.data.data.map((item) => ({
          ...item,
        }));
        this.isLoading = false;
      });
  }

  exportCSV() {
    const body = {
      page: 0,
      size: 1000,
      sort: null,
      contains: null,
      fromDate: null,
      toDate: null,
    };
    this._keypairService
      .getData(body)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((pagedData) => {
        console.log(pagedData);
        if (!pagedData.data.data || !pagedData.data.data.length) {
          return;
        }
        const separator = ',';
        const keys = Object.keys(pagedData.data.data[0]);
        const csvData =
          keys.join(separator) +
          '\n' +
          pagedData.data.data
            .map((row) => {
              return keys
                .map((k) => {
                  if (k !== 'createdAt') {
                    console.log('Test');
                  }
                  let cell =
                    row[k] === null || row[k] === undefined ? '' : row[k];
                  cell =
                    cell instanceof Date
                      ? cell.toLocaleString()
                      : cell.toString().replace(/"/g, '""');
                  if (cell.search(/("|,|\n)/g) >= 0) {
                    cell = `"${cell}"`;
                  }
                  return cell;
                })
                .join(separator);
            })
            .join('\n');

        const blob = new Blob(['\ufeff' + csvData], {
          type: 'text/csv;charset=utf-8;',
        });
        const link = document.createElement('a');
        if (link.download !== undefined) {
          // Browsers that support HTML5 download attribute
          const url = URL.createObjectURL(blob);
          link.setAttribute('href', url);
          link.setAttribute('download', 'Danh Sách Cặp Khóa');
          link.style.visibility = 'hidden';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      });
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
