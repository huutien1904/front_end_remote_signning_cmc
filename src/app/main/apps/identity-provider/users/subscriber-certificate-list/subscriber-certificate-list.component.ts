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
import { ToastrService } from 'ngx-toastr';
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
  public fileUploaded = true;

  formUploadCert: FormGroup;
  formListSubscriberCertificate: FormGroup;
  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    private _usersService: UsersService,
    private toastr: ToastrService,
  ) {
    this.formUploadCert = this.fb.group({
      certificateContent: ['', Validators.required],
      userId: [null, Validators.required],
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
  onFileChange(event) {
    this.fileUploaded = true;
    console.log(event);
    if (event.target.files.length > 0) {
      console.log(event.target.files);
      const file = event.target.files[0];
      this.formUploadCert.get("certificateContent").setValue(file);
      console.log(this.formUploadCert.get("certificateContent"));
    }
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
        this.rowsData = pagedData.data.data.map((item) => ({
          ...item,
          // organizationName: this.getOrganization(item),
          // subscribeName: this.getSubscriber(item),
        }));
        this.isLoading = false;
      });
  }
  onSubmitCert(): boolean {
  
    if (this.formUploadCert.invalid) {
      this.fileUploaded = false
      return;
    }
    this._usersService
      .updateCert(this.formUploadCert)
      .subscribe(
        (res) => {
          console.log(res.result);
          if (res.result === true) {
            this.toastr.success(
              "👋 Bạn đã cập nhật chứng thư số",
              "Thành công",
              {
                positionClass: "toast-top-center",
                toastClass: "toast ngx-toastr",
                closeButton: true,
              }
            );
            this.modalRef.close();
          } else {
            this.toastr.error("👋Chứng thư số cập nhật", "Thất bại", {
              positionClass: "toast-top-center",
              toastClass: "toast ngx-toastr",
              closeButton: true,
            });
          }
        },
        (error) => {
          alert("Chứng thư số không đúng. Vui lòng thử lại");
          return false;
        }
      );
  }
}
