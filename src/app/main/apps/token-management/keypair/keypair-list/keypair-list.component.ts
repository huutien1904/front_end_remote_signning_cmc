import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import {  FormBuilder, FormGroup, Validators } from "@angular/forms";
import { CoreConfigService } from "@core/services/config.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { PersonalService } from "app/main/apps/identity-provider/subscribers/personals/personal.service";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { DateAdapter } from "@angular/material/core";
import {
  ColumnMode,
  DatatableComponent,
  SelectionType,
} from "@swimlane/ngx-datatable";
import { PagedData } from "app/main/models/PagedData"
import { Personal } from "app/main/models/Personal";
import { KeypairListService } from './keypair-list.service';
import { Keypair } from 'app/main/models/Keypair';
import { Router } from '@angular/router';

@Component({
  selector: "app-keypair-list",
  templateUrl: "./keypair-list.component.html",
  styleUrls: ["./keypair-list.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class KeypairListComponent implements OnInit {
  minDate: Date;
  maxDate: Date;
  private _unsubscribeAll: Subject<any>;
  public formListPersonal: FormGroup;
  public formListKeypair: FormGroup;
  public item: any;
  public contentHeader: object;
  //page setup
  @ViewChild(DatatableComponent) table: DatatableComponent;
  @ViewChild("tableRowDetails") tableRowDetails: any;
  public isLoading: boolean = false;
  public ColumnMode = ColumnMode;
  public moreOption = true;
  public sizePage: number[] = [5, 10, 15, 20, 50, 100];
  gender: string[] = ["Nam", "Nữ"];
  public pagedData = new PagedData<Keypair>();
  public rowsData = new Array<Keypair>();

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
    this.formListPersonal = this.fb.group({
      page: [null],
      size: [this.sizePage[2]],
      sort : [null],
      contains: [null, Validators.required],
      fromDate: [null],
      toDate: [null],
      gender: [],
      birthday: [],
    });
    // this.pagedData.size = this.sizePage[3];
    // this.pagedData.currentPage = 0;
    this.setPage({ offset: 0, pageSize: this.formListPersonal.get('size').value });
    this.contentHeader = {
      headerTitle: 'Cặp khóa',
      actionButton: true,
      breadcrumb: {
        type: 'chevron',
        links: [
          {
            name: 'Danh sách cặp khóa',
            isLink: false,
            link: '/apps/tm/keypair/keypair-list'
          }
        ]
      }
    };
  }


  setPage(pageInfo) {
    console.log(pageInfo);
    const body = {
      page: null,
      size: null,
      sort: null,
      contains: null,
      fromDate: null,
      toDate: null,
    };
      this._keypairService
      .getData(body)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((pagedData) => {
         console.log(pagedData)
        this.pagedData = pagedData.data;
        this.rowsData = pagedData.data.data;
        console.log(this.rowsData)
        this.rowsData = pagedData.data.data.map(item => ({
          ...item,
        }))
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
   onActivate(event) {
    if (
      event.type === 'click' &&
      event.column.name != 'Hành động' &&
      event.column.name != 'checkbox'
    ) {
      console.log(event.row)
      this._router.navigate([
        '/apps/tm/keypair/keypair-view/',event.row.keypairId,
      ]);
    }
  }
  onSelect({ selected }) {
    console.log("Select Event", selected, this.selected);
    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
  }

  toggleSidebar(modalForm, item) {
    this.item = item;
    console.log(item);
    this.modal.open(modalForm, {size: 'xl'})
  }

  onSubmit() {
    console.log(this.formListPersonal);
  }
  console(row){
    console.log(row)
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