import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CertificateRequestService } from '../certificate-request.service';
import * as x509 from "@peculiar/x509";

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
  // private
  private _unsubscribeAll: Subject<any>;
  constructor(
    private route: ActivatedRoute,
    private _certificateRequestService: CertificateRequestService,
    //Khởi tạo service, đồng thời phải khởi tạo trong provider trong request module
  ) {
    this._unsubscribeAll = new Subject();

  }


  ngOnInit(): void {
    this.buttonReturn = {
      breadcrumbs: {
        links: [
          {
            name:'Quay lại',
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

      .subscribe((response:any) => {
        console.log(response.data.certificateRequestContent)
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
    const csr2 = new x509.Pkcs10CertificateRequest(csrString);
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
    return this.results[0];
  }
  // selectIdUserFirst(value) {
  //   // console.log(event.target.value)
  //   // console.log(value)
  //   this.inputService.findListPersional(value).subscribe((res: any) => {
  //     //If api return true: show toast success
  //     if (res.result === true) {
  //       // console.log(res.data)
  //       this.subscriberIdList = []
  //       for (let i = 0; i < res.data.length; i++) {
  //         this.subscriberIdList = [...this.subscriberIdList, {
  //           id: res.data[i].subscriberId,
  //           content: res.data[i].subscriberId + ", Họ & Tên: "
  //             + res.data[i].personalFirstName + " "
  //             + res.data[i].personalMiddleName + " "
  //             + res.data[i].personalLastName + ", CCCD: "
  //             + res.data[i].personalCountryId + ", Email: "
  //             + res.data[i].email
  //         }]
  //       }
  //       this.formSubmitOne.get("subscriberIdForm").setValue(this.subscriberIdList[0])
  //     }
  //     // and vice versa
  //     if (res.result === false) {

  //     }
  //   })

  // }
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
