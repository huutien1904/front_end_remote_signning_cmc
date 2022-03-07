import { async } from '@angular/core/testing';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { CoreConfigService } from '@core/services/config.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  ColumnMode,
  DatatableComponent,
  SelectionType,
} from '@swimlane/ngx-datatable';
import { EntityProfileService } from 'app/main/apps/identity-provider/entity-profiles/entity-profile.service';
import { PersonalService } from 'app/main/apps/identity-provider/subscribers/personals/personal.service';
import { PagedData } from 'app/main/models/PagedData';
import { Personal } from 'app/main/models/Personal';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-personals',
  templateUrl: './personals.component.html',
  styleUrls: ['./personals.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class PersonalsComponent implements OnInit {
  minDate: Date;
  maxDate: Date;
  public rowsData = new Array<Personal>();
  private _unsubscribeAll: Subject<any>;
  public formListPersonal: FormGroup;
  public totalItems: any = 0;
  public item: any;
  //page setup
  @ViewChild(DatatableComponent) table: DatatableComponent;
  @ViewChild('tableRowDetails') tableRowDetails: any;

  public isLoading: boolean = false;
  public ColumnMode = ColumnMode;
  public moreOption = true;
  public sizePage: number[] = [5, 10, 15, 20, 50, 100];
  gender: string[] = ['Nam', 'Nữ'];
  public pagedData = new PagedData<Personal>();
  public chkBoxSelected = [];
  public selected = [];
  public SelectionType = SelectionType;
  public rowDataSelected = [];
  public listSubjectDn = [];
  public bodyGetListProfile = {
    page: 0,
    size: 10,
    sort: [],
    contains: '',
    fromDate: '',
    toDate: '',
  };
  public idProfile: number;
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
    private _personalService: PersonalService,
    private _coreConfigService: CoreConfigService,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private dateAdapter: DateAdapter<any>,
    private toastr: ToastrService,
    private _entityProfileService: EntityProfileService
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
    this.formListPersonal = this.fb.group({
      page: [''],
      size: [this.sizePage[3]],
      sort: [['staffId,asc']],
      contains: ['', Validators.required],
      gender: [null],
      dateOfBirth: [''],
      fromDate: [''],
      toDate: [''],
    });
    this.setPage({
      offset: 0,
      pageSize: this.formListPersonal.get('size').value,
    });
    this.getListProfiles();
  }

  //Set Table View
  setPage(pageInfo) {
    console.log(pageInfo);
    this.isLoading = true;
    this.formListPersonal.patchValue({ page: pageInfo.offset });
    console.log(this.formListPersonal.value);
    this._personalService
      .getListPersonals(JSON.stringify(this.formListPersonal.value))
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((pagedData) => {
        console.log(pagedData);
        this.totalItems = pagedData.data.totalItems;
        this.pagedData = pagedData.data;
        this.rowsData = pagedData.data.data.map((personalList: any) => ({
          ...personalList,
          personalFirstName:
            personalList.firstName +
            ' ' +
            personalList.middleName +
            ' ' +
            personalList.lastName,
        }));
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
  onSelect({ selected }) {
    console.log('Select Event', selected, this.selected);
    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
    console.log(this.selected);
  }
  async getListProfiles() {
    await this._entityProfileService
      .getListProfiles(this.bodyGetListProfile)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((res) => {
        console.log(res);
        this.idProfile = res.data.data[0].endEntityProfileId;
        // var profileId = this.listProfiles[0].id
        // console.log(this.personals)
        // console.log(this.listProfiles)
        // this.getListSubjectDn(profileId);
      });
  }
  async createCertificateRequest(modalForm) {
    this.listSubjectDn = [];
    this.selected.map((personal) => {
      this._entityProfileService
        .getSubjectDnById(personal.staffId, this.idProfile)
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((res) => {
          console.log(personal);
          this.listSubjectDn.push({
            subjectDn: JSON.stringify(res)
              .replace('{', ' ')
              .replace('}', ' ')
              .replace(/['"]+/g, '')
              .replace(/[":"]+/g, ' = '),
            alias: personal.username + Math.floor(Math.random() * 1000 + 1),
          });
        });
    });
    this.toggleSidebar(modalForm, this.selected[0]);
  }
  toggleSidebar(modalForm, item) {
    // console.log(this.)
    this.item = item;
    console.log(item);
    this.modalService.open(modalForm, { size: 'xl' });
  }
  closeModalCreateListCertificate() {
    console.log('dong modal');

    this.selected = [];
    console.log(this.selected);
    this.modalService.dismissAll();
  }
  openNewSelectModal(modal) {
    this.rowDataSelected = this.selected;
    this.modalService.open(modal, {
      centered: true,
      size: 'xl',
    });
  }

  acceptSelected(modal) {
    modal.close('Accept click');
    alert('Gửi yêu cầu chứng thực thành công');
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
