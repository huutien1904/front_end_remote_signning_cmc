import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { CoreConfigService } from '@core/services/config.service';
import {
  NgbDateParserFormatter
} from '@ng-bootstrap/ng-bootstrap';
import {
  ColumnMode, DatatableComponent, SelectionType
} from '@swimlane/ngx-datatable';
import { PagedData } from 'app/main/models/PagedData';
import { SubscriberCertificate } from 'app/main/models/SubscriberCertificate';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SubscriberCertificateListService } from './subscriber-certificate-list.service';
import * as x509 from "@peculiar/x509";
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-subscriber-certificate-list',
  templateUrl: './subscriber-certificate-list.component.html',
  styleUrls: ['./subscriber-certificate-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SubscriberCertificateListComponent implements OnInit {
  minDate: Date;
  maxDate: Date;
  private _unsubscribeAll: Subject<any>;
  public SelectionType = SelectionType;
  public chkBoxSelected = [];
  public selected = [];
  public listFileUrl
  public dataFromNodeForge : any
  //Public Properties
  formListSubscriberCertificate: FormGroup;
  public sizePage: number[] = [5, 10, 15, 20, 50, 100];
  public pageAdvancedEllipses = 1;
  public moreOption = true;
  public contentHeader: object;
  public dataExport:any
  public dataFromX509 : any
  public signatureParameters : any
  public keyUsage : any = ""
  public basicConstraints : any = ""
  public extKeyUsage : any = ""
  public thumbprint : any = ""
  public modulus : any = ""

  //page setup
  @ViewChild(DatatableComponent) table: DatatableComponent;
  @ViewChild('tableRowDetails') tableRowDetails: any;
  public pagedData = new PagedData<SubscriberCertificate>();
  public rowsData = new Array<SubscriberCertificate>();
  public isLoading: boolean = false;
  //Table of personal data
  public totalItems: any = 0;
  public ColumnMode = ColumnMode;
  constructor(
    private _coreConfigService: CoreConfigService,
    private fb: FormBuilder,
    public formatter: NgbDateParserFormatter,
    public _subscriberCertificateService: SubscriberCertificateListService,
    private dateAdapter: DateAdapter<any>,
    private _router: Router,
    private sanitizer: DomSanitizer,
    private toastr: ToastrService,

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
      headerTitle: 'Chứng thư số',
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

  //Set Table View
  setPage(pageInfo) {
    console.log(pageInfo);
    this.isLoading = true;
    this.formListSubscriberCertificate.patchValue({ page: pageInfo.offset });
    this._subscriberCertificateService
      .getListSubscriberCertificates(
        JSON.stringify(this.formListSubscriberCertificate.value)
      )
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((pagedData) => {
        this.totalItems = pagedData.data.totalItems;
        this.pagedData = pagedData.data;
        this.rowsData = pagedData.data.data.map((item) => ({
          ...item,
          SubjectDN: this.readCertificate(item.certificateContent).subject
          // organizationName: this.getOrganization(item),
          // subscribeName: this.getSubscriber(item),
        }));
        // this.rowsData = pagedData.data.data;
        console.log(this.rowsData)
        this.isLoading = false;
      });
  }

  getOrganization(item): any {
    let info = this._subscriberCertificateService.readCertificate(
      item.certificate
    );
    let rs = info.find((obj) => obj.name === 'organizationalUnitName');
    if (rs == undefined) return;
    return rs.value;
  }
  getSubscriber(item): any {
    let info = this._subscriberCertificateService.readCertificate(
      item.certificate
    );
    console.log(info);
    return info.find((obj) => obj.name === 'commonName').value;
  }
  changePage(e) {}
  onSubmit() {
    console.log(this.formListSubscriberCertificate.value);
    console.log(this.formListSubscriberCertificate.get('toDate').value);
  }
  // 
  downloadOne(row) {
    console.log(row)
    const data = row.certificateContent;
    console.log(data)
    const blob = new Blob([data], { type: 'crt' });
    row.fileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      window.URL.createObjectURL(blob)
    );
    row.fileName = row.keypairAlias  + '.crt.crt';
    // console.log(row);
  }
  downloadList(){
    console.log(this.selected)
    // const data = this.selected.map()
    var data = ""
    this.selected.map((item) =>{
      // console.log(item.certificateRequestContent)
      return data += "requestId : " + item.subscriberCertificateId +'\n'+  item.certificateContent + '\n' 

    })
    console.log(data)
    const blob = new Blob([data], { type: 'pem' });
    this.listFileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      window.URL.createObjectURL(blob)
    );
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
  }
  onActivate(event) {
    if(!event.event.ctrlKey && event.event.type === 'click' && event.column.name!="Hành động" && event.column.name!="checkbox") {
      this._router.navigate(['/apps/tm/subscriber-certificate/subscriber-certificate-view', event.row.subscriberCertificateId]);
      
    }
  }
  exportCSV() {
    this._subscriberCertificateService
      .getListSubscriberCertificates(JSON.stringify(this.formListSubscriberCertificate.value))
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((pagedData) => {
        console.log(pagedData)
        this.totalItems = pagedData.data.totalItems;
        console.log(pagedData);
        console.log(pagedData.data.data);
        this.dataExport = pagedData.data.data.map((item:any) => ({
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
            .map((row:any) => {
              return keys
                .map((k) => {
                 
                  if(k === "certificateContent"){
                    row[k] = delete row[k].certificateContent
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

        const blob = new Blob(['\ufeff'+csvData], { type: 'text/csv;charset=utf-8;' });
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

  // read subcriber-certificate
  readCertificate(certPem) {
    console.log(certPem)
    let read = '-----BEGIN CERTIFICATE-----\r\n' +
    certPem +
            '\r\n-----END CERTIFICATE-----\r\n'
    //Đọc chứng thư số ra dạng JSON theo 2 cách dùng Node-Force & X509
    // var forge = require('node-forge');
    // this.dataFromNodeForge = forge.pki.certificateFromPem(read);
    // console.log(this.dataFromNodeForge)
    
    
    // this.issuerDN = this.dataFromNodeForge.subject
    this.dataFromX509 = new x509.X509Certificate(read);
    //  lấy dữ liệu từ chứng thư số
    console.log(this.dataFromX509)
    return this.dataFromX509
    

    //Trạng thái đã đọc xong chứng thư số
  }
  // delete item subscriber certificate 
  openConfirmDelete(subscriberCertificateId) {
    this.confirmRemoveRequestCertificate(subscriberCertificateId);
  }
  confirmRemoveRequestCertificate(subscriberCertificateId) {
    Swal.fire({
      title: 'Bạn có chắc muốn xóa?',
      text: "Bạn sẽ không thể hoàn tác điều này!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#7367F0',
      preConfirm: async () => {
        this.deleteSubscriberCertificate(subscriberCertificateId)
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
  deleteSubscriberCertificate(id) {
    this._subscriberCertificateService
      .deleteSubscriberCertificateById(id)
      .subscribe((res) => {
        if (res.result === true) {
          this.setPage({
            offset: 0,
            pageSize: this.formListSubscriberCertificate.get('size').value
          })
        }
      })
  }
  deleteListSubscriber(){
    if(this.selected.length > 0){
      Swal.fire({
      title: 'Bạn có chắc muốn xóa?',
      text: "Bạn sẽ không thể hoàn tác điều này!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#7367F0',
      preConfirm: async () => {
        this.selected.map((subcriber) =>{
          this.deleteSubscriberCertificate(subcriber.subscriberCertificateId)
        })
        
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
    else{
      this.toastr.warning(
        '👋 Bạn chưa chọn chứng thư số để xóa ',
        'Cảnh báo',
        {
          positionClass: 'toast-top-center',
          toastClass: 'toast ngx-toastr',
          closeButton: true,
        }
      );
    }
    
    
  }
  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
