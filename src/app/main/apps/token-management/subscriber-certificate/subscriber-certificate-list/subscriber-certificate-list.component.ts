import { async } from '@angular/core/testing';
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
import { takeUntil, filter } from 'rxjs/operators';
import { SubscriberCertificateListService } from './subscriber-certificate-list.service';
import * as x509 from "@peculiar/x509";
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { FileSaverService } from 'ngx-filesaver';

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
  public dataFromNodeForge: any
  //Public Properties
  formListSubscriberCertificate: FormGroup;
  public sizePage: number[] = [5, 10, 15, 20, 50, 100];
  public pageAdvancedEllipses = 1;
  public moreOption = true;
  public contentHeader: object;
  public dataExport: any
  public dataFromX509: any
  public signatureParameters: any
  public keyUsage: any = ""
  public basicConstraints: any = ""
  public extKeyUsage: any = ""
  public thumbprint: any = ""
  public modulus: any = ""
  public hsmList = [];
  public slotList=[];
  //page setup
  @ViewChild(DatatableComponent) table: DatatableComponent;
  @ViewChild('tableRowDetails') tableRowDetails: any;
  public pagedData = new PagedData<SubscriberCertificate>();
  public rowsData:any = new Array<SubscriberCertificate>();
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
    private _FileSaverService: FileSaverService,

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
      headerTitle: 'Ch???ng th?? s???',
      actionButton: true,
      breadcrumb: {
        type: 'chevron',
        links: [
          {
            name: 'Danh s??ch',
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
      hsmSearchName:[],
      slotSearchName:[],
    });

    this.setPage({
      offset: 0,
      pageSize: this.formListSubscriberCertificate.get('size').value,
    });

    this.getListHsm();
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
      .subscribe( async (pagedData) => {
        console.log(pagedData)
        this.pagedData = pagedData.data;
        
        var data = pagedData.data.data.map((item) =>({
          ...item,
          SubjectDN: this.readCertificate(item.certificateContent).subject
        }))
        console.log(pagedData.data.data)
        this.rowsData = data.filter((item) =>{
          return item.keypairStatus.keypairStatusName == "???? g???i y??u c???u ch???ng th???c"
        })
        
        this.pagedData.totalItems = this.rowsData.length
        this.totalItems = this.rowsData.length;
        console.log(this.rowsData)
        
        console.log(this.totalItems)
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
  changePage(e) { }
  onSubmit() {
    console.log(this.formListSubscriberCertificate.value);
    console.log(this.formListSubscriberCertificate.get('toDate').value);
  }
  // 
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
  async downloadList() {


    if (this.selected.length > 1) {
      var zip = new JSZip();
      this.selected.map((item) => {
        console.log(item)
        zip.file(item.fullName +item.subscriberCertificateId + ".pem", item.certificateContent);
      })
      await zip.generateAsync({ type: "blob" })
        .then(blob => saveAs(blob, 'Danh s??ch ch???ng th?? s???.zip'));
      this.chkBoxSelected =[];
    }
    if (this.selected.length == 1) {
      console.log("1")
      var fileName;

      var data: any = '';
      this.selected.map((item) => {
        fileName = `${item.fullName}.pem`;
        // console.log(item.certificateRequestContent)
        return data += item.certificateContent + '\n'
      });
      console.log(fileName, data)
      await this._FileSaverService.save(data, fileName);
      this.chkBoxSelected =[];

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
    console.log('Select Event', selected, this.selected);
    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
  }
  onActivate(event) {
    if (!event.event.ctrlKey && event.event.type === 'click' && event.column.name != "H??nh ?????ng" && event.column.name != "checkbox") {
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

                  if (k === "certificateContent") {
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

        const blob = new Blob(['\ufeff' + csvData], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        if (link.download !== undefined) {
          // Browsers that support HTML5 download attribute
          const url = URL.createObjectURL(blob);
          link.setAttribute('href', url);
          link.setAttribute('download', 'Danh s??ch Ch???ng th?? s???');
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
    //?????c ch???ng th?? s??? ra d???ng JSON theo 2 c??ch d??ng Node-Force & X509
    // var forge = require('node-forge');
    // this.dataFromNodeForge = forge.pki.certificateFromPem(read);
    // console.log(this.dataFromNodeForge)


    // this.issuerDN = this.dataFromNodeForge.subject
    this.dataFromX509 = new x509.X509Certificate(read);
    //  l???y d??? li???u t??? ch???ng th?? s???
    console.log(this.dataFromX509)
    return this.dataFromX509


    //Tr???ng th??i ???? ?????c xong ch???ng th?? s???
  }
  // delete item subscriber certificate 
  openConfirmDelete(subscriberCertificateId) {
    this.confirmRemoveRequestCertificate(subscriberCertificateId);
  }
  confirmRemoveRequestCertificate(subscriberCertificateId) {
    Swal.fire({
      title: 'B???n c?? ch???c mu???n x??a?',
      text: "X??a ch???ng th?? s??? l?? x??a c??? c???p kh??a c???a thu?? bao trong c?? s??? d??? li???u!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#7367F0',
      preConfirm: async () => {
        this.deleteSubscriberCertificate(subscriberCertificateId)
      },
      cancelButtonColor: '#E42728',
      cancelButtonText: "Tho??t",
      confirmButtonText: '????ng, t??i mu???n x??a!',
      customClass: {
        confirmButton: 'btn btn-primary',
        cancelButton: 'btn btn-danger ml-1'
      },
      allowOutsideClick: () => {
        return !Swal.isLoading();
      }
    }).then(function (result: any) {
      console.log(result)
      if (result.isDismissed === true && result.value === true && result.isConfirmed === true) {
        Swal.fire({
          icon: 'success',
          title: 'Th??nh c??ng!',
          text: 'B???n ???? x??a th??nh c??ng',
          customClass: {
            confirmButton: 'btn btn-success'
          }
        });
      } 
      if(result.isDismissed === false && result.isConfirmed === true && result.value === true) {
        Swal.fire({
          icon: 'warning',
          title: 'Th???t b???i!',
          text: 'Kh??ng th??? x??a ch???ng th?? s??? t???o t??? super admin',
          customClass: {
            confirmButton: 'btn btn-waring'
          }
        });
      }
    }

    );

  }
  deleteSubscriberCertificate(id) {
    this._subscriberCertificateService
      .deleteSubscriberCertificateById(id)
      .toPromise()
      .then((res) => {
        if (res.result === true) {
          this.setPage({
            offset: 0,
            pageSize: this.formListSubscriberCertificate.get('size').value
          })
        }
      })
  }
  deleteListSubscriber() {
    if (this.selected.length > 0) {
      Swal.fire({
        title: 'B???n c?? ch???c mu???n x??a?',
        text: "X??a ch???ng th?? s??? l?? x??a c??? c???p kh??a c???a thu?? bao trong c?? s??? d??? li???u",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#7367F0',
        preConfirm: async () => {
          this.selected.map((subscriber) => {
            this.deleteSubscriberCertificate(subscriber.subscriberCertificateId)
          })
          this.chkBoxSelected = []
        },
        cancelButtonColor: '#E42728',
        cancelButtonText: "Tho??t",
        confirmButtonText: '????ng, t??i mu???n x??a!',
        customClass: {
          confirmButton: 'btn btn-primary',
          cancelButton: 'btn btn-danger ml-1'
        },
        allowOutsideClick: () => {
          return !Swal.isLoading();
        }
      }).then(function (result: any) {
        console.log(result)
        if (result.value === true && result.isConfirmed === true) {
          Swal.fire({
            icon: 'success',
            title: 'Th??nh c??ng!',
            text: 'B???n ???? x??a th??nh c??ng',
            customClass: {
              confirmButton: 'btn btn-success'
            }
          });
        }
        // if(result.isDismissed === false && result.isConfirmed === true && result.value === true){
        //   Swal.fire({
        //     icon: 'warning',
        //     title: 'Th???t b???i!',
        //     text: 'Kh??ng th??? x??a ch???ng th??? s??? t???o b???ng superadmin',
        //     customClass: {
        //       confirmButton: 'btn btn-warning'
        //     }
        //   });
        // }
      }
      

      );
    }
    else {
      this.toastr.warning(
        '???? B???n ch??a ch???n ch???ng th?? s??? ????? x??a ',
        'C???nh b??o',
        {
          positionClass: 'toast-top-center',
          toastClass: 'toast ngx-toastr',
          closeButton: true,
        }
      );
    }


  }

  getListHsm(){
    this._subscriberCertificateService.getListHsm
    ({
      page: 0,
      size: 10000,
      sort : ["hsmId,asc"],
      contains : "",
      fromDate : "",
      toDate : "" 
    })
    .toPromise()
    .then((hsmList) => {
      console.log(hsmList);
      this.hsmList = hsmList.data.data;
      this.slotList = this.hsmList[0].tokens
      console.log(this.hsmList)
      this.formListSubscriberCertificate.controls['hsmSearchName'].setValue(this.hsmList[0])
      this.formListSubscriberCertificate.controls['slotSearchName'].setValue(this.slotList[0])
       
      // // console.log(this.hsmName)
      // this.tokenList = this.hsmList[0].tokens;
      // this.slotSearchName = this.tokenList[0].tokenName
      // this.tokenName = this.hsmList[0].tokens[0].tokenName;
      // console.log(this.hsmList);
      // console.log(this.tokenList);
    });
  }
  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
