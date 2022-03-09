import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CertificateRequestService } from '../certificate-request.service';
import * as x509 from "@peculiar/x509";
import { DomSanitizer } from '@angular/platform-browser';
import Swal from 'sweetalert2';
import { CertificateRequestListService } from '../certificate-request-list/certificate-request-list.service';

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
  public personalFullName;
  public personalEmail;
  public userName;

  // private
  private _unsubscribeAll: Subject<any>;
  constructor(
    private route: ActivatedRoute,
    private _listCerReqService: CertificateRequestListService,
    private _certificateRequestService: CertificateRequestService,
    private sanitizer: DomSanitizer,
    private router : Router

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
        this.personalEmail = response.data.email;
        this.userName = response.data.username
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
  
  openConfirmDelete() {
    const routerParams = this.route.snapshot.paramMap
    const id = routerParams.get('id')
    this.confirmRemoveRequestCertificate(id);
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
          this.router.navigate(['/apps/tm/certificate-request/certificate-request-list']);
        }
      })
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
    this.results[0].subjectDN.replace('0.9.2342.19200300.100.1.1', 'C').replace('2.5.4.20', 'telephoneNumber').replace('E=', 'gmail')
    console.log(this.results[0].subjectDN)
    let check = this.results[0].subjectDN
    this.subjectDn = this.results[0].subjectDN.replace('0.9.2342.19200300.100.1.1', 'C').replace('2.5.4.20', 'telephoneNumber ').replace('E=', 'Gmail = ').replace('2.5.4.9', 'STREET ')
    this.personalFullName = this.subjectDn.slice(this.subjectDn.indexOf("=") + 1, this.subjectDn.indexOf(","));
    // console.log(tien)
    return this.results[0];
  }

  // downloadCertificate() {
  //   const data = this.dataCertificateRequest.data.certificateRequestContent
  //   console.log(data)
  //   const blob = new Blob([data], { type: 'application/octet-stream' });
  //   // this.fileName = "tien."
  //   // this.listFileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
  //   //   window.URL.createObjectURL(blob)
  //   // );
  //   const url= window.URL.createObjectURL(blob);
  //   window.open(url);
  // }
  downloadCertificate(){
    const data = this.dataCertificateRequest.data.certificateRequestContent
    console.log(data)
    const blob = new Blob([data], { type: 'csr' });
    this.listFileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      window.URL.createObjectURL(blob)
    );
  }  
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
