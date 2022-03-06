import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CertificateRequestService } from '../certificate-request.service';
import * as x509 from "@peculiar/x509";
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-certificate-request-view',
  templateUrl: './certificate-request-view.component.html',
  styleUrls: ['./certificate-request-view.component.scss']
})
export class CertificateRequestViewComponent implements OnInit {

  // public 
  public cer
  public results: any[]
  public isHasResult: Boolean = false //Hiển thị kế quả thông tin csr trả về
  public buttonReturn: object;
  public subjectDn: any
  public listFileUrl;
  public fileName;
  public dataCertificateRequest;
  // private
  private _unsubscribeAll: Subject<any>;
  constructor(
    private route: ActivatedRoute,
    private _certificateRequestService: CertificateRequestService,
    private sanitizer: DomSanitizer,
  ) {
    this._unsubscribeAll = new Subject();

  }


  ngOnInit(): void {
    this.buttonReturn = {
      breadcrumbs: {
        links: [
          {
            name: 'Quay lại',
            isLink: true,
            link: "/apps/tm/certificate-request/certificate-request-list",
          }
        ]
      }
    };
    this.results = [{
      algorithmSignature: "",
      sizeKeys: "",
      subjectDN: "",
      algorithmPublicKey: "",
      sizePublicKey: "",
      modulus: "",
      exponent: ""
    }]
    this.getCertificateRequestById();
  }
  getCertificateRequestById() {
    const routerParams = this.route.snapshot.paramMap
    const id = routerParams.get('id')
    console.log(id)
    this._certificateRequestService
      .getCertificateRequestById(id)
      .pipe(takeUntil(this._unsubscribeAll))

      .subscribe((response: any) => {
        this.dataCertificateRequest = response
        console.log(response)
        this.getCSRFileInformation(response.data.certificateRequestContent)
        // this.data = response.data
        // this.address = response.data.address
        // this.birthPlace = response.data.birthPlace
        // console.log("address", this.address)
        // console.log("birthPlace", this.birthPlace)
        // this.provinceBirth = this._addressService.getProvince(this.birthPlace.)
      });
  }
  getCSRFileInformation(csrString) {
    console.log(csrString)
    csrString = csrString.replace("NEW ", "").replace("NEW ", "")
    var forge = require('node-forge');
    //var csr = forge.pki.certificationRequestFromPem(csrString);
    const csr2:any = new x509.Pkcs10CertificateRequest(csrString);
    console.log(csr2)
    var pki = forge.pki;
    this.results[0].subjectDN = csr2.subject

    //this.results[0].sizePublicKey = csr2.publicKey.n.bitLength()
    this.results[0].algorithmPublicKey = csr2.signatureAlgorithm.name
    //this.results[0].exponent = csr2.publicKey.e.data
    //console.log(pki.oids[csr2.siginfo.algorithmOid])
    console.log(csr2.publicKey.algorithm.name)
    this.isHasResult = true
    var pki = forge.pki;
    if (csr2.publicKey.algorithm.name === 'ECDSA') {
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
    console.log(modulus)
    this.results[0].modulus = modulus
    this.results[0].subjectDN.replace('0.9.2342.19200300.100.1.1', 'C').replace('2.5.4.20', 'Phone_Number').replace('E=', 'gmail')
    console.log(this.results[0].subjectDN)
    let check = this.results[0].subjectDN
    this.subjectDn = this.results[0].subjectDN.replace('0.9.2342.19200300.100.1.1', 'C').replace('2.5.4.20', 'Phone_Number ').replace('E=', 'Gmail = ').replace('2.5.4.9', 'STREET ')
    // console.log(tien)
    return this.results[0];
  }

  downloadCertificate() {
    const data = this.dataCertificateRequest.data.certificateRequestContent
    console.log(data)
    const blob = new Blob([data], { type: 'application/octet-stream' });
    // this.fileName = "tien."
    // this.listFileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
    //   window.URL.createObjectURL(blob)
    // );
    const url= window.URL.createObjectURL(blob);
    window.open(url);
  }
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
