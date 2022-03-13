import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CertificateRequestListService } from './certificate-request-list.service';
import { Subject } from 'rxjs';
import { DateAdapter } from '@angular/material/core';
import { CoreConfigService } from '@core/services/config.service';
import { takeUntil } from 'rxjs/operators';
import * as JSZip from 'jszip';
import { saveAs } from 'file-saver';

import {
  ColumnMode,
  DatatableComponent,
  SelectionType,
} from '@swimlane/ngx-datatable';
import { PagedData } from 'app/main/models/PagedData';
import { CertificateRequest } from 'app/main/models/CertificateRequest';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import * as x509 from '@peculiar/x509';
import Swal from 'sweetalert2';
import { ToastrService } from "ngx-toastr";

@Component({
  selector: 'app-certificate-request-list',
  templateUrl: './certificate-request-list.component.html',
  styleUrls: ['./certificate-request-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CertificateRequestListComponent implements OnInit {
  //Public Properties
  @ViewChild(DatatableComponent) table: DatatableComponent;
  @ViewChild('tableRowDetails') tableRowDetails: any;
  minDate: Date;
  maxDate: Date;
  public rowsData = new Array<CertificateRequest>();
  public pagedData = new PagedData<CertificateRequest>();
  public totalItems: any = 0;
  public moreOption = true;
  public sizePage: number[] = [5, 10, 15, 20, 50, 100];
  public formListCertificateRequest: FormGroup;
  private _unsubscribeAll: Subject<any>;
  public chkBoxSelected = [];
  public selected = [];
  public SelectionType = SelectionType;
  public isLoading: boolean = false;
  public ColumnMode = ColumnMode;
  public contentHeader: object;
  public listFileUrl;
  public results: any[];
  public dataExport: any;
  public statusCertificate = [
    {
      status: "Tạo mới"
    }
  ]
  constructor(
    private fb: FormBuilder,
    private _listCerReqService: CertificateRequestListService,
    private _coreConfigService: CoreConfigService,
    private dateAdapter: DateAdapter<any>,
    private sanitizer: DomSanitizer,
    private _router: Router,
    private _toastrService: ToastrService,

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
    this.contentHeader = {
      headerTitle: 'Yêu cầu chứng thực',
      actionButton: true,
      breadcrumb: {
        type: 'chevron',
        links: [
          {
            name: 'Danh sách',
            isLink: false,
          },
        ],
      },
    };
    this.formListCertificateRequest = this.fb.group({
      page: [null],
      size: [this.sizePage[3]],
      sort: [null],
      contains: [null],
      fromDate: [null],
      toDate: [null],
    });
    console.log(this.formListCertificateRequest.valid);

    this.results = [
      {
        algorithmSignature: '',
        sizeKeys: '',
        subjectDN: '',
        algorithmPublicKey: '',
        sizePublicKey: '',
        modulus: '',
        exponent: '',
      },
    ];
    this.setPage({
      offset: 0,
      pageSize: this.formListCertificateRequest.get('size').value,
    });
    console.log(this.rowsData);
  }

  // getOrganization(item): any {
  //   let info = this._listCerReqService.readCertificate(item.certificateRequestContent);
  //   let rs = info.find((obj) => obj.name === 'organizationalUnitName');
  //   if (rs == undefined) return;
  //   return rs.value;
  // }
  // getSubscribe(item): any {
  //   // console.log(item)
  //   let info = this._listCerReqService.readCertificate(item.certificateRequestContent);
  //   console.log(info)
  //   console.log(info.find((obj) => obj.name === 'commonName').value)

  //   return info.find((obj) => obj.name === 'commonName').value;
  // }
  setPage(pageInfo) {
    this.isLoading = true;
    this.formListCertificateRequest.patchValue({ page: pageInfo.offset });
    this._listCerReqService
      .getListCertificateRequests(
        JSON.stringify(this.formListCertificateRequest.value)
      )
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((pagedData) => {
        this.totalItems = pagedData.data.totalItems;
        this.pagedData = pagedData.data;
        this.rowsData = pagedData.data.data;
        console.log(this.rowsData);

        this.rowsData = pagedData.data.data.map((item) => ({
          ...item,
          subjectDN: this.getCSRFileInformation(item.certificateRequestContent)
            .subjectDN.replace('0.9.2342.19200300.100.1.1', 'C').replace('2.5.4.20', 'telephoneNumber').replace('E=', 'gmail'),
          algorithmPublickey: this.getCSRFileInformation(
            item.certificateRequestContent
          ).algorithmPublicKey.includes('RSA')
            ? 'RSA'
            : this.getCSRFileInformation(
              item.certificateRequestContent
            ).algorithmPublicKey.includes('ECDSA')
              ? 'ECDSA'
              : this.getCSRFileInformation(
                item.certificateRequestContent
              ).algorithmPublicKey.includes('DSA')
                ? 'DSA'
                : this.getCSRFileInformation(
                  item.certificateRequestContent
                ).algorithmPublicKey.includes('Ed25519')
                  ? 'Ed25519'
                  : 'Ed448',
          sizePublicKey: this.getCSRFileInformation(
            item.certificateRequestContent
          ).sizePublicKey,
        }));
        this.isLoading = false;
        console.log(this.rowsData);
      });
  }

  downloadSidebar(row) {
    const data = row.certificateRequestContent;
    console.log(row);
    const blob = new Blob([data], { type: 'csr' });
    row.fileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      window.URL.createObjectURL(blob)
    );
    row.fileName =
      row.subjectDN.slice(row.subjectDN.indexOf("=") + 1, row.subjectDN.indexOf(",")) + ".csr.csr";
    console.log(row);
  }
  downloadList(event) {
    console.log(event)
    
    if (this.selected.length > 0) {
      var zip = new JSZip();
        this.selected.map((item) =>{
          zip.file(item.fullName + ".csr", item.certificateRequestContent);
        })
        zip.generateAsync({ type: "blob" })
          .then(blob => saveAs(blob,'Danh sách yêu cầu chứng thực.zip'));
    } 
    else {
      
      this._toastrService.warning(
        '👋 Bạn chưa chọn yêu cầu chứng thực',
        'Cảnh báo',
        {
          positionClass: 'toast-top-center',
          toastClass: 'toast ngx-toastr',
          closeButton: true,
        }
      );
      event.defaultPrevented = true;
    }
  }

  exportCSV() {
    if(this.selected.length > 0) {
      this._listCerReqService
        .getListCertificateRequests(
          JSON.stringify(this.formListCertificateRequest.value)
        )
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((pagedData) => {
          console.log(pagedData);
          this.totalItems = pagedData.data.totalItems;
          console.log(pagedData);
          console.log(pagedData.data.data);
          this.dataExport = pagedData.data.data.map((item) => ({
            ...item,
            subjectDN: this.getCSRFileInformation(item.certificateRequestContent)
              .subjectDN,
            certificateRequestContent: this.getCSRFileInformation(
              item.certificateRequestContent
            ).algorithmPublicKey.includes('RSA')
              ? 'RSA'
              : this.getCSRFileInformation(
                item.certificateRequestContent
              ).algorithmPublicKey.includes('ECDSA')
                ? 'ECDSA'
                : this.getCSRFileInformation(
                  item.certificateRequestContent
                ).algorithmPublicKey.includes('DSA')
                  ? 'DSA'
                  : this.getCSRFileInformation(
                    item.certificateRequestContent
                  ).algorithmPublicKey.includes('Ed25519')
                    ? 'Ed25519'
                    : 'Ed448',
            sizePublicKey: this.getCSRFileInformation(
              item.certificateRequestContent
            ).sizePublicKey,
          }));
          console.log(this.dataExport);
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
                    console.log(k);
                    console.log(row[k]);
                    // if(k === "distinguishedName"){
                    //   row[k] = row[k].distinguishedName
                    //   console.log(row[k]);
                    // }
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
            link.setAttribute('download', 'Danh sách Yêu cầu chứng thực');
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }
        });
    }
    else{
      this._toastrService.warning(
        '👋 Bạn chưa chọn yêu cầu chứng thực ',
        'Cảnh báo',
        {
          positionClass: 'toast-top-center',
          toastClass: 'toast ngx-toastr',
          closeButton: true,
        }
      );
    }
  }
  // delete item certificate
  openConfirmDelete(certificateRequestId) {
    this.confirmRemoveRequestCertificate(certificateRequestId);
  }
  confirmRemoveRequestCertificate(certificateRequestId) {
    Swal.fire({
      title: 'Bạn có chắc muốn xóa?',
      text: "Bạn sẽ không thể hoàn tác điều này!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#7367F0',
      preConfirm: async () => {
        this.deleteRequestCertificate(certificateRequestId)
      },
      cancelButtonColor: '#E42728',
      cancelButtonText: "Thoát",
      confirmButtonText: 'Đúng, tôi muốn xóa!',
      customClass: {
        confirmButton: 'btn btn-primary',
        cancelButton: 'btn btn-danger ml-1'
      },
      allowOutsideClick: () => {
        return !Swal.isLoading();
      }
    }).then(function (result: any) {
      console.log(result)
      if (result.value) {
        Swal.fire({
          icon: 'success',
          title: 'Thành công!',
          text: 'Bạn đã xóa thành công',
          customClass: {
            confirmButton: 'btn btn-success'
          }
        });
      }
    }

    );

  }
  deleteRequestCertificate(id) {
    this._listCerReqService
      .deleteCertificateRequestById(id)
      .subscribe((res) => {
        if (res.result === true) {
          this.setPage({
            offset: 0,
            pageSize: this.formListCertificateRequest.get('size').value
          })
        }
      })
  }
  deleteListRequestCertificate(body) {
    this._listCerReqService
      .deleteListCertificateRequest(body)
      .subscribe((res) => {
        console.log(res)
        if (res.result === true) {
          this.setPage({
            offset: 0,
            pageSize: this.formListCertificateRequest.get('size').value
          })
        }
      })
  }
  // delete list item certificate
  deleteListCertificate() {
    console.log("1",this.selected.length);
    console.log("check",this.selected);
    if(this.selected.length > 0){
      console.log("2.1")

      var selectedCertificate = []
      this.selected.map((item) => {
        selectedCertificate.push(item.certificateRequestId)
      })
      Swal.fire({
        title: 'Bạn có chắc muốn xóa?',
        text: "Bạn sẽ không thể hoàn tác điều này!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#7367F0',
        preConfirm: async () => {
          console.log(JSON.stringify({ "certListReq": selectedCertificate }))
          this.deleteListRequestCertificate(JSON.stringify({ "certListReq": selectedCertificate }))
        },
        cancelButtonColor: '#E42728',
        cancelButtonText: "Thoát",
        confirmButtonText: 'Đúng, tôi muốn xóa!',
        customClass: {
          confirmButton: 'btn btn-primary',
          cancelButton: 'btn btn-danger ml-1'
        },
        allowOutsideClick: () => {
          return !Swal.isLoading();
        }
      }).then(function (result: any) {
        console.log(result)
        if (result.value) {
          Swal.fire({
            icon: 'success',
            title: 'Thành công!',
            text: 'Bạn đã xóa thành công',
            customClass: {
              confirmButton: 'btn btn-success'
            }
          });
        }
      }
  
      );
      this.selected = []
      console.log(this.selected)
      return 0;
    }
    if(this.selected.length == 0){
      console.log("2.2")
      this._toastrService.warning(
        '👋 Bạn chưa chọn yêu cầu chứng thực',
        'Cảnh báo',
        {
          positionClass: 'toast-top-center',
          toastClass: 'toast ngx-toastr',
          closeButton: true,
        }
      );
    }
    
    
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
    this.selected = []
    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
  }
  onActivate(event) {
    // console.log(event);
    if (
      !event.event.ctrlKey &&
      event.event.type === 'click' &&
      event.column.name != 'Hành động' &&
      event.column.name != 'checkbox'
    ) {
      this._router.navigate([
        '/apps/tm/certificate-request/certificate-request-view',
        event.row.certificateRequestId,
      ]);
    }
  }
  getCSRFileInformation(csrString) {
    var forge = require('node-forge');
    const csr2: any = new x509.Pkcs10CertificateRequest(csrString);
    console.log(csr2);

    //var csr = forge.pki.certificationRequestFromPem(csrString);
    //console.log(csr)

    var pki = forge.pki;
    if (csr2.publicKey.algorithm.name === 'ECDSA') {
      // var csr = forge.pki.certificationRequestFromPem(csrString);
      // const csr2 = new x509.Pkcs10CertificateRequest(csrString);
      this.results[0].subjectDN = csr2.subject;
      this.results[0].algorithmPublicKey = csr2.publicKey.algorithm.name;
      this.results[0].sizePublicKey = csr2.publicKey.algorithm.namedCurve;
    }
    if (csr2.publicKey.algorithm.name === 'RSASSA-PKCS1-v1_5') {
      var csr = forge.pki.certificationRequestFromPem(csrString);
      const csr2 = new x509.Pkcs10CertificateRequest(csrString);
      this.results[0].sizePublicKey = csr.publicKey.n.bitLength();
      this.results[0].exponent = csr.publicKey.e.data;
      this.results[0].subjectDN = csr2.subject;
      this.results[0].algorithmPublicKey = csr2.publicKey.algorithm.name;
      this.results[0].algorithmSignature = pki.oids[csr.siginfo.algorithmOid];

      var modulus = '';
      for (let i = 0; i < csr.publicKey.n.toByteArray().length; i++) {
        var hex = (csr.publicKey.n.toByteArray()[i] >>> 0)
          .toString(16)
          .slice(-2);
        if (hex.length < 2) {
          hex = '0' + hex;
        }
        if (modulus == '') {
          modulus = hex;
          // modulus = rgbToHex(csr.publicKey.n.toByteArray()[i])
        } else {
          modulus = modulus + ':' + hex;
          // modulus = modulus + ":" + rgbToHex(csr.publicKey.n.toByteArray()[i])
        }
      }
    }
    return this.results[0];
    //this.results[0].modulus = modulus
  }
  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
