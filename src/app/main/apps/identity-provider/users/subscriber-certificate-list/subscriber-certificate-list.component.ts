import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  ColumnMode,
  DatatableComponent,
  SelectionType,
} from '@swimlane/ngx-datatable';
import { PagedData } from 'app/main/models/PagedData';
import { Personal } from 'app/main/models/Personal';
import { SubscriberCertificate } from 'app/main/models/SubscriberCertificate';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { UsersService } from '../users.service';

@Component({
  selector: 'app-subscriber-certificate-list',
  templateUrl: './subscriber-certificate-list.component.html',
  styleUrls: ['./subscriber-certificate-list.component.scss'],
})
export class SubscriberCertificateListComponent implements OnInit {
  public rowDataSelected = [];
  public selected = [];
  public modalRef;
  public pagedData = new PagedData<SubscriberCertificate>();
  public rowsData = new Array<SubscriberCertificate>();
  public isLoading: boolean = false;
  public totalItems: any = 0;
  public ColumnMode = ColumnMode;
  public chkBoxSelected = [];
  public SelectionType = SelectionType;
  public sizePage: number[] = [5, 10, 15, 20, 50, 100];
  private _unsubscribeAll = new Subject();
  public personalSelected: Personal;

  formUploadCert: FormGroup;
  formListSubscriberCertificate: FormGroup;
  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    private _usersService: UsersService,
  ) {
    this.formUploadCert = this.fb.group({
      certificateContent: ['', Validators.required],
      userId: [null, Validators.required],
      certificate: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.formListSubscriberCertificate = this.fb.group({
      contains: [null],
      fromDate: [null],
      sort: [null],
      toDate: [null],
      page: [null],
      size: [this.sizePage[3]],
    });
    this.setPage({
      offset: 0,
      pageSize: this.formListSubscriberCertificate.get('size').value,
    });
  }

  customCheckboxOnSelect({ selected }) {
    this.chkBoxSelected.splice(0, this.chkBoxSelected.length);
    this.chkBoxSelected.push(...selected);
  }
  onSelect({ selected }) {
    console.log('Select Event', selected, this.selected);
    console.log(selected);
    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
  }
  openNewCertModal(modal) {
    this.rowDataSelected = this.selected;
    this.formUploadCert.reset();
    this.modalRef = this.modalService.open(modal, {
      centered: true,
      size: 'lg',
    });
  }
  setPage(pageInfo) {
    console.log(pageInfo);
    this.isLoading = true;
    this.formListSubscriberCertificate.patchValue({ page: pageInfo.offset });
    this._usersService
      .getListSubscriberCertificates(
        JSON.stringify(this.formListSubscriberCertificate.value)
      )
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((pagedData) => {
        this.totalItems = pagedData.data.totalItems;
        this.pagedData = pagedData.data;
        this.rowsData = pagedData.data.data;
        this.isLoading = false;
      });
  }
}
