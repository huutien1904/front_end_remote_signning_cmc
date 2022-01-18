import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CertificateRequestListService } from './certificate-request-list.service';
import { Subject } from 'rxjs';
import { DateAdapter } from '@angular/material/core';
import { CoreConfigService } from '@core/services/config.service';
import { takeUntil } from 'rxjs/operators';
import {
  ColumnMode,
  DatatableComponent,
  SelectionType,
} from '@swimlane/ngx-datatable';
import { PagedData } from 'app/main/models/PagedData';
import { CertificateRequest } from 'app/main/models/CertificateRequest';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import * as x509 from "@peculiar/x509";

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
  public results: any[]
  constructor(
    private fb: FormBuilder,
    private _listCerReqService: CertificateRequestListService,
    private _coreConfigService: CoreConfigService,
    private dateAdapter: DateAdapter<any>,
    private sanitizer: DomSanitizer,
    private _router: Router,
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
    this.formListCertificateRequest = this.fb.group({
      contains: [null],
      fromDate: [null],
      sort: [null],
      toDate: [null],
      page: [null],
      size: [this.sizePage[3]],
    });
    this.setPage({
      offset: 0,
      pageSize: this.formListCertificateRequest.get('size').value,
    });
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
      sort : [null],
      contains: [null],
      fromDate: [null],
      toDate: [null],
    });
    
    this.results = [{
      algorithmSignature: "",
      sizeKeys: "",
      subjectDN: "",
      algorithmPublicKey: "",
      sizePublicKey: "",
      modulus: "",
      exponent: ""
  }]
    this.setPage({ offset: 0, pageSize: this.formListCertificateRequest.get('size').value });
    console.log(this.rowsData);
  }

  getOrganization(item): any {
    let info = this._listCerReqService.readCertificate(item.certificateRequestContent);
    let rs = info.find((obj) => obj.name === 'organizationalUnitName');
    if (rs == undefined) return;
    return rs.value;
  }
  getSubscribe(item): any {
    // console.log(item)
    let info = this._listCerReqService.readCertificate(item.certificateRequestContent);
    console.log(info)
    console.log(info.find((obj) => obj.name === 'commonName').value)

    return info.find((obj) => obj.name === 'commonName').value;
  }
  setPage(pageInfo) {
    this.isLoading = true;
    this.formListCertificateRequest.patchValue({ page: pageInfo.offset });
    this._listCerReqService
      .getListCertificateRequests(JSON.stringify(this.formListCertificateRequest.value))
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((pagedData) => {
        
        this.totalItems = pagedData.data.totalItems;
        this.pagedData = pagedData.data;
        this.rowsData = pagedData.data.data;
        console.log(this.rowsData)
        this.rowsData = pagedData.data.data.map((item) => ({
          ...item,
          subjectDN:this.getCSRFileInformation(item.certificateRequestContent).subjectDN,
          algorithmPublickey:this.getCSRFileInformation(item.certificateRequestContent).algorithmPublicKey + "," + this.getCSRFileInformation(item.certificateRequestContent).sizePublicKey ,
          organizationName: this.getOrganization(item),
          subscribeName: this.getSubscribe(item),
        }));
        this.isLoading = false;
        console.log(this.rowsData)
      });
  }

  downloadSidebar(row) {
    const data = row.certificateRequestContent;
    console.log(row)
    const blob = new Blob([data], { type: 'application/octet-stream' });
    row.fileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      window.URL.createObjectURL(blob)
    );
    row.fileName = row.keypairAlias + 'requestId' + row.certificateRequestId + '.csr';
    console.log(row);
  }
  downloadList(){
    console.log(this.selected)
    // const data = this.selected.map()
    var data = ""
    this.selected.map((item) =>{
      // console.log(item.certificateRequestContent)
      return data += item.certificateRequestContent

    })
    console.log(data)
    const blob = new Blob([data], { type: 'application/octet-stream' });
    this.listFileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      window.URL.createObjectURL(blob)
    );
  }
  exportCSV(){
    console.log("tien");
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
    // console.log(event);
    if(!event.event.ctrlKey && event.event.type === 'click' && event.column.name!="Hành động" && event.column.name!="checkbox") {
      this._router.navigate(['/apps/tm/certificate-request/certificate-request-view', event.row.certificateRequestId]);
      
    }
  }
  getCSRFileInformation(csrString) {
    console.log(csrString)
    csrString = csrString.replace("NEW ", "").replace("NEW ", "")
    var forge = require('node-forge');
    var csr = forge.pki.certificationRequestFromPem(csrString);
    const csr2 = new x509.Pkcs10CertificateRequest(csrString);
    var pki = forge.pki;
    this.results[0].subjectDN = csr2.subject
    this.results[0].sizePublicKey = csr.publicKey.n.bitLength()
    this.results[0].algorithmPublicKey = csr2.publicKey.algorithm.name
    this.results[0].exponent = csr.publicKey.e.data
    this.results[0].algorithmSignature = pki.oids[csr.siginfo.algorithmOid]
    // try {
    //   var email = csr.subject.getField('E').value
    //   // console.log(email)
    //   this.selectIdUserFirst(email)
    // } catch (error) {
    //   try {
    //     var cn = csr.subject.getField('CN').value;
    //     // console.log(cn)
    //     this.selectIdUserByCN(cn)
    //   } catch (error) {
    //   }
    // }

    var modulus = ""
    for (let i = 0; i < csr.publicKey.n.toByteArray().length; i++) {

      var hex = (csr.publicKey.n.toByteArray()[i] >>> 0).toString(16).slice(-2)
      if (hex.length < 2) {
        hex = "0" + hex
      }
      if (modulus == "") {
        modulus = hex
        // modulus = rgbToHex(csr.publicKey.n.toByteArray()[i])
      } else {
        modulus = modulus + ":" + hex
        // modulus = modulus + ":" + rgbToHex(csr.publicKey.n.toByteArray()[i])
      }
    }
    console.log(this.results[0])
    return this.results[0]
    this.results[0].modulus = modulus
  }
  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
