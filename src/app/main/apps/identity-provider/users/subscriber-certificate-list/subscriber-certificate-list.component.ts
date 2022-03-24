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
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { FileSaverService } from 'ngx-filesaver';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import * as x509 from '@peculiar/x509';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-subscriber-certificate-list',
  templateUrl: './subscriber-certificate-list.component.html',
  styleUrls: ['./subscriber-certificate-list.component.scss'],
})
export class SubscriberCertificateListComponent implements OnInit {
  public rowDataSelected = [];
  public selected = [];
  public modalRef;
  public dataExport: any;
  public pagedData = new PagedData<SubscriberCertificate>();
  public rowsData = new Array<SubscriberCertificate>();
  public isLoading: boolean = false;
  public dataFromX509: any;
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
    private _FileSaverService: FileSaverService,
    private _router: Router,
    private sanitizer: DomSanitizer,
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
      this.formUploadCert.get('certificateContent').setValue(file);
      console.log(this.formUploadCert.get('certificateContent'));
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
      .subscribe(async (pagedData) => {
        console.log(pagedData);
        this.pagedData = pagedData.data;

        var data = pagedData.data.data.map((item) => ({
          ...item,
          SubjectDN: this.readCertificate(item.certificateContent).subject,
        }));
        console.log(pagedData.data.data);
        this.rowsData = data.filter((item) => {
          return (
            item.keypairStatus.keypairStatusName == 'Đã gửi yêu cầu chứng thực'
          );
        });

        this.pagedData.totalItems = this.rowsData.length;
        this.totalItems = this.rowsData.length;
        console.log(this.rowsData);

        console.log(this.totalItems);
        this.isLoading = false;
      });
  }
  readCertificate(certPem) {
    console.log(certPem);
    let read =
      '-----BEGIN CERTIFICATE-----\r\n' +
      certPem +
      '\r\n-----END CERTIFICATE-----\r\n';
    //Đọc chứng thư số ra dạng JSON theo 2 cách dùng Node-Force & X509
    // var forge = require('node-forge');
    // this.dataFromNodeForge = forge.pki.certificateFromPem(read);
    // console.log(this.dataFromNodeForge)

    // this.issuerDN = this.dataFromNodeForge.subject
    this.dataFromX509 = new x509.X509Certificate(read);
    //  lấy dữ liệu từ chứng thư số
    console.log(this.dataFromX509);
    return this.dataFromX509;

    //Trạng thái đã đọc xong chứng thư số
  }
  async downloadList() {
    if (this.selected.length > 1) {
      var zip = new JSZip();
      this.selected.map((item) => {
        console.log(item);
        zip.file(
          item.fullName + item.subscriberCertificateId + '.pem',
          item.certificateContent
        );
      });
      await zip
        .generateAsync({ type: 'blob' })
        .then((blob) => saveAs(blob, 'Danh sách chứng thư số.zip'));
      this.chkBoxSelected = [];
    }
    if (this.selected.length == 1) {
      console.log('1');
      var fileName;

      var data: any = '';
      this.selected.map((item) => {
        fileName = `${item.fullName}.pem`;
        // console.log(item.certificateRequestContent)
        return (data += item.certificateContent + '\n');
      });
      console.log(fileName, data);
      await this._FileSaverService.save(data, fileName);
      this.chkBoxSelected = [];
    }
  }
  // delete item subscriber certificate
  openConfirmDelete(subscriberCertificateId) {
    this.confirmRemoveRequestCertificate(subscriberCertificateId);
  }
  confirmRemoveRequestCertificate(subscriberCertificateId) {
    Swal.fire({
      title: 'Bạn có chắc muốn xóa?',
      text: 'Xóa chứng thư số là xóa cả cặp khóa của thuê bao trong cơ sở dữ liệu!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#7367F0',
      preConfirm: async () => {
        this.deleteSubscriberCertificate(subscriberCertificateId);
      },
      cancelButtonColor: '#E42728',
      cancelButtonText: 'Thoát',
      confirmButtonText: 'Đúng, tôi muốn xóa!',
      customClass: {
        confirmButton: 'btn btn-primary',
        cancelButton: 'btn btn-danger ml-1',
      },
      allowOutsideClick: () => {
        return !Swal.isLoading();
      },
    }).then(function (result: any) {
      console.log(result);
      if (
        result.isDismissed === true &&
        result.value === true &&
        result.isConfirmed === true
      ) {
        Swal.fire({
          icon: 'success',
          title: 'Thành công!',
          text: 'Bạn đã xóa thành công',
          customClass: {
            confirmButton: 'btn btn-success',
          },
        });
      }
      if (
        result.isDismissed === false &&
        result.isConfirmed === true &&
        result.value === true
      ) {
        Swal.fire({
          icon: 'warning',
          title: 'Thất bại!',
          text: 'Không thể xóa chứng thư số tạo từ super admin',
          customClass: {
            confirmButton: 'btn btn-waring',
          },
        });
      }
    });
  }
  deleteListSubscriber() {
    if (this.selected.length > 0) {
      Swal.fire({
        title: 'Bạn có chắc muốn xóa?',
        text: 'Xóa chứng thư số là xóa cả cặp khóa của thuê bao trong cơ sở dữ liệu',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#7367F0',
        preConfirm: async () => {
          this.selected.map((subscriber) => {
            this.deleteSubscriberCertificate(
              subscriber.subscriberCertificateId
            );
          });
          this.chkBoxSelected = [];
        },
        cancelButtonColor: '#E42728',
        cancelButtonText: 'Thoát',
        confirmButtonText: 'Đúng, tôi muốn xóa!',
        customClass: {
          confirmButton: 'btn btn-primary',
          cancelButton: 'btn btn-danger ml-1',
        },
        allowOutsideClick: () => {
          return !Swal.isLoading();
        },
      }).then(function (result: any) {
        console.log(result);
        if (result.value === true && result.isConfirmed === true) {
          Swal.fire({
            icon: 'success',
            title: 'Thành công!',
            text: 'Bạn đã xóa thành công',
            customClass: {
              confirmButton: 'btn btn-success',
            },
          });
        }
        // if(result.isDismissed === false && result.isConfirmed === true && result.value === true){
        //   Swal.fire({
        //     icon: 'warning',
        //     title: 'Thất bại!',
        //     text: 'Không thể xóa chứng thứ số tạo bằng superadmin',
        //     customClass: {
        //       confirmButton: 'btn btn-warning'
        //     }
        //   });
        // }
      });
    } else {
      this.toastr.warning('👋 Bạn chưa chọn chứng thư số để xóa ', 'Cảnh báo', {
        positionClass: 'toast-top-center',
        toastClass: 'toast ngx-toastr',
        closeButton: true,
      });
    }
  }
  deleteSubscriberCertificate(id) {
    this._usersService
      .deleteSubscriberCertificateById(id)
      .toPromise()
      .then((res) => {
        if (res.result === true) {
          this.setPage({
            offset: 0,
            pageSize: this.formListSubscriberCertificate.get('size').value,
          });
        }
      });
  }
  exportCSV() {
    this._usersService
      .getListSubscriberCertificates(
        JSON.stringify(this.formListSubscriberCertificate.value)
      )
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((pagedData) => {
        console.log(pagedData);
        this.totalItems = pagedData.data.totalItems;
        console.log(pagedData);
        console.log(pagedData.data.data);
        this.dataExport = pagedData.data.data.map((item: any) => ({
          ...item,
          keypairStatus: item.keypairStatus.keypairStatusName,
          // certificateContent:"",
          // delete item.certificateContent,
          // delete certificateContent:"",
          // delete item.certificateContent
        }));
        if (!this.dataExport || !this.dataExport.length) {
          return;
        }
        const separator = ',';
        const keys = Object.keys(this.dataExport[0]);
        const csvData =
          keys.join(separator) +
          '\n' +
          this.dataExport
            .map((row: any) => {
              return keys
                .map((k) => {
                  if (k === 'certificateContent') {
                    row[k] = delete row[k].certificateContent;
                  }
                  // if(k === "distinguishedName"){
                  //   row[k] = row[k].distinguishedName
                  // }
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
          link.setAttribute('download', 'Danh sách Chứng thư số');
          link.style.visibility = 'hidden';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      });
  }
  downloadOne(row) {
    console.log(row)
    const data = row.certificateContent;
    console.log(data)
    const blob = new Blob([data], { type: 'pem' });
    row.fileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      window.URL.createObjectURL(blob)
    );
    row.fileName = row.fullName + '.pem';
    // console.log(row);
  }
  onActivate(event) {
    if (
      !event.event.ctrlKey &&
      event.event.type === 'click' &&
      event.column.name != 'Hành động' &&
      event.column.name != 'checkbox'
    ) {
      this._router.navigate([
        '/apps/tm/subscriber-certificate/subscriber-certificate-view',
        event.row.subscriberCertificateId,
      ]);
    }
  }
  onSubmitCert(): boolean {
    if (this.formUploadCert.invalid) {
      this.fileUploaded = false;
      return;
    }
    this._usersService.updateCert(this.formUploadCert).subscribe(
      (res) => {
        console.log(res.result);
        if (res.result === true) {
          this.toastr.success('👋 Bạn đã cập nhật chứng thư số', 'Thành công', {
            positionClass: 'toast-top-center',
            toastClass: 'toast ngx-toastr',
            closeButton: true,
          });
          this.modalRef.close();
        } else {
          this.toastr.error('👋Chứng thư số cập nhật', 'Thất bại', {
            positionClass: 'toast-top-center',
            toastClass: 'toast ngx-toastr',
            closeButton: true,
          });
        }
      },
      (error) => {
        alert('Chứng thư số không đúng. Vui lòng thử lại');
        return false;
      }
    );
  }
}
