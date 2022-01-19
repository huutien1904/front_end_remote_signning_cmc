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
    const blob = new Blob([data], { type: 'application/octet-stream' });
    row.fileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      window.URL.createObjectURL(blob)
    );
    row.fileName = row.keypairAlias + 'requestId' + row.subscriberCertificateId + '.csr';
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
    const blob = new Blob([data], { type: 'application/octet-stream' });
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
    var forge = require('node-forge');
    this.dataFromNodeForge = forge.pki.certificateFromPem(read);
    console.log(this.dataFromNodeForge)
    
    
    // this.issuerDN = this.dataFromNodeForge.subject
    this.dataFromX509 = new x509.X509Certificate(read);
    //  lấy dữ liệu từ chứng thư số
    console.log(this.dataFromX509)
    return this.dataFromX509
    //Đọc signatureParameters
    this.signatureParameters = this.dataFromNodeForge.signatureParameters
    if(Object.keys(this.signatureParameters).length == 0) //(*)
    {
      this.signatureParameters = "05 00"
    }
    else {
      this.signatureParameters = JSON.stringify(this.signatureParameters) //(**)
    }
    if(this.dataFromNodeForge.extensions.length > 0){
      //Đọc keyUsage
      if(this.dataFromNodeForge.extensions[4].cRLSign) this.keyUsage += "CRL Signing, "
      // if(this.dataFromNodeForge.extensions[4].critical) this.keyUsage += "Critical, "
      if(this.dataFromNodeForge.extensions[4].dataEncipherment) this.keyUsage += "Data Encipherment, "
      if(this.dataFromNodeForge.extensions[4].decipherOnly) this.keyUsage += "Decipher Only, "
      if(this.dataFromNodeForge.extensions[4].digitalSignature) this.keyUsage += "Digital Signature, "
      if(this.dataFromNodeForge.extensions[4].encipherOnly) this.keyUsage += "Encipher Only, "
      if(this.dataFromNodeForge.extensions[4].keyAgreement) this.keyUsage += "Key Agreement, "
      if(this.dataFromNodeForge.extensions[4].keyCertSign) this.keyUsage += "Key CertSign, "
      if(this.dataFromNodeForge.extensions[4].keyEncipherment) this.keyUsage += "Key Encipherment, "
      if(this.dataFromNodeForge.extensions[4].nonRepudiation) this.keyUsage += "Non Repudiation, "
      //Đọc basicConstraints
    //Nếu ca = false thì Subject Type là End Entity nếu không là CA
    if(this.dataFromX509.extensions[0].ca) this.basicConstraints += "Subject Type=CA, "
    else this.basicConstraints += "Subject Type=End Entity, "
    if(this.dataFromX509.extensions[0].pathLength==undefined) this.basicConstraints += "Path Length Constraint=None"
    else this.basicConstraints += "Path Length Constraint="+this.dataFromX509.extensions[0].pathLength
    }

    


    //Đọc @thumbprint
    var certAsn1 = forge.pki.certificateToAsn1(this.dataFromNodeForge);
    var certDer = forge.asn1.toDer(certAsn1).getBytes();
    //SHA-1 on certificate binary data
    var md =  forge.md.sha1.create();
    md.start();
    md.update(certDer);
    var digest = md.digest();
    this.thumbprint = digest.toHex();

    //Đọc extKeyUsage
    if(this.dataFromNodeForge.extensions.length > 0){
      if(this.dataFromNodeForge.extensions[2].clientAuth) this.extKeyUsage += "Client Authentication (1.3.6.1.5.5.7.3.2) "
      // if(this.dataFromNodeForge.extensions[2].critical) this.extKeyUsage += "Critical "
      if(this.dataFromNodeForge.extensions[2].emailProtection) this.extKeyUsage += "Secure Email (1.3.6.1.5.5.7.3.4) "
      //Tham khả IDO tại: https://oidref.com/1.3.6.1.5.5.7.3.2
    }
   


    //Đọc modulus
    for (let i = 0; i < this.dataFromNodeForge.publicKey.n.toByteArray().length; i++) {
      var hex = (this.dataFromNodeForge.publicKey.n.toByteArray()[i] >>> 0).toString(16).slice(-2)
      if (hex.length < 2) {
        hex = "0" + hex
      }
      if (this.modulus == "") {
        this.modulus = hex
        // modulus = rgbToHex(csr.publicKey.n.toByteArray()[i])
      } else {
        this.modulus = this.modulus + ":" + hex
        // modulus = modulus + ":" + rgbToHex(csr.publicKey.n.toByteArray()[i])
      }
    }

    //Trạng thái đã đọc xong chứng thư số
  }
  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
