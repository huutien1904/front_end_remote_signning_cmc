import { Component, Input, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import {  FormBuilder, FormGroup, Validators } from "@angular/forms";
import { CoreConfigService } from "@core/services/config.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { DateAdapter } from "@angular/material/core";
import {
  ColumnMode,
  DatatableComponent,
  SelectionType,
} from "@swimlane/ngx-datatable";
import { PagedData } from "app/main/models/PagedData"
import { KeypairListService } from "../keypair-list.service";
import { Keypair } from "app/main/models/Keypair";

@Component({
  selector: 'app-list-sidebar',
  templateUrl: './list-sidebar.component.html',
  styleUrls: ['./list-sidebar.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [KeypairListService]
})
export class ListSidebarComponent implements OnInit {
  public cryptoSelect: any[] = [ 'RSA', 'ECDSA'];
  public rsaKeyLength: any[] = ['1024', '1536', '2048', '3072', '4096', '6144', '8192'];
  public ecdsaKeyLength: any[] = ['brainpoolIP160r1', 'brainpoolIP160t1', 'brainpoolIP192r1', 'brainpoolIP192t1',
  'brainpoolIP224r1', 'brainpoolIP224t1', 'brainpoolIP256r1', 'brainpoolIP256t1', 'brainpoolIP384r1', 'brainpoolIP384t1', 'brainpoolIP521r1', 'brainpoolIP521t1'];
  public lengthSelect: any[] = [];
  @Input() personal: any;
  minDate: Date;
  maxDate: Date;
  public rowsData = new Array<Keypair>();
  private _unsubscribeAll: Subject<any>;
  public formListKeypair: FormGroup;
  public item: any;

  //page setup
  @ViewChild(DatatableComponent) table: DatatableComponent;
  @ViewChild("tableRowDetails") tableRowDetails: any;
  public isLoading: boolean = false;
  public ColumnMode = ColumnMode;
  public moreOption = true;
  public sizePage: number[] = [5, 10, 15, 20, 50, 100];
  public pagedData = new PagedData<Keypair>();
  public chkBoxSelected = [];
  public selected = [];
  public SelectionType = SelectionType;

    /**
   *
   * @param _keypairService
   * @param _coreSidebarService
   * @param modalService
   * @param fb
   * @param dateAdapter
   * @param _coreSidebarService
   */
  constructor(
    private fb: FormBuilder,
    private _keypairService: KeypairListService,
    private _coreConfigService: CoreConfigService,
    private modal: NgbModal,
    private dateAdapter: DateAdapter<any>,

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
    this.pagedData.size = this.sizePage[3];
    this.pagedData.currentPage = 0;
    this.setPage({ offset: 0, pageSize: this.pagedData.size });
  }

  changePage() {
    this.pagedData.size = this.formListKeypair.get("sizePage").value;
    this.setPage({ offset: 0, pageSize: this.pagedData.size });
  }

  setPage(pageInfo) {
    this.isLoading=true;
    this.pagedData.currentPage = pageInfo.offset;
    this.pagedData.size = pageInfo.pageSize;
    // this._keypairService
    //   .getData(this.pagedData, this.personal.subscriberId)
    //   .pipe(takeUntil(this._unsubscribeAll))
    //   .subscribe((pagedData) => {
    //     console.log(pagedData)
    //     this.pagedData = pagedData.data;
    //     this.rowsData = pagedData.data.data;
    //     console.log(this.rowsData)
    //     this.rowsData = pagedData.data.data.map(item => ({
    //       ...item,
    //     }))
    //     this.isLoading=false;
    //   });
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

  toggleSidebar() {
    this.modal.dismissAll();
  }

  onSubmit() {
    console.log(this.formListKeypair);
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  changeCrypto(event) {
    this.formListKeypair.patchValue({
      keypairLength: null
    })
    this.formListKeypair.get('keypairLength').enable();
    switch (event) {
      case 'RSA':
        this.lengthSelect = this.rsaKeyLength;
        break;
      case 'ECDSA':
        this.lengthSelect = this.ecdsaKeyLength;
        break;
    }
  }

}
