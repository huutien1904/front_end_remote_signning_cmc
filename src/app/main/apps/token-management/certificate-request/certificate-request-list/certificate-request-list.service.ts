import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import * as forge from 'node-forge';
import { CertificateRequest } from 'app/main/models/CertificateRequest';
import { ResponseData } from 'app/main/models/ResponseData';
import { PagedData } from 'app/main/models/PagedData';
import * as x509 from "@peculiar/x509";

@Injectable({
  providedIn: 'root'
})
export class CertificateRequestListService{
  // public

  public onUserListChanged: BehaviorSubject<any>;
  public isHasResult = false;
  results = {
    algorithmPublicKey: "",
    sizePublicKey: "",
    modulus: "",
    exponent: ""
}
  /**
   * Constructor
   * @param {HttpClient} _httpClient
   */

  private readonly currentUser = JSON.parse(
    localStorage.getItem("currentUser")
  );
  private readonly token = this.currentUser.token;
  private option = {
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + this.token,
    },
  };
  constructor(private _httpClient: HttpClient) {
    this.onUserListChanged = new BehaviorSubject({});
  }

  readCertificate(cer): any[] {
      // const cert = e.target.result;
      // //console.log(cert);
    // let getCertString = cer
    //   .replace("-----BEGIN CERTIFICATE REQUEST-----", "")
    //   .replace(/\r?\n|\r/g, "")
    //   .replace("-----END CERTIFICATE REQUEST-----", "");
    //   console.log(getCertString)
    //decode
    let read: any = forge.pki.certificationRequestFromPem(cer);
    console.log(read)
    //get attributes
    read = read.subject.attributes;

    //dich tieng Viet 
    let res: any[] = JSON.parse( forge.util.decodeUtf8( JSON.stringify(read)));
    console.log(res)
    return res;
  }
  getCSRInformation(csrString) {
    this.isHasResult = false
    console.log(csrString)
    csrString = csrString.replace("NEW ", "").replace("NEW ", "")
    var forge = require('node-forge');
    var csr = forge.pki.certificationRequestFromPem(csrString);
    const csr2 = new x509.Pkcs10CertificateRequest(csrString);
    var pki = forge.pki;
    // this.results[0].subjectDN = csr2.subject
    this.results.sizePublicKey = csr.publicKey.n.bitLength()
    this.results.algorithmPublicKey = csr2.publicKey.algorithm.name
    this.results.exponent = csr.publicKey.e.data
    // this.results.algorithmSignature = pki.oids[csr.siginfo.algorithmOid]

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
    this.results.modulus = modulus
    this.isHasResult = true

  }

  public getListCertificateRequests(body) :Observable<ResponseData<PagedData<CertificateRequest>>>{
     return this._httpClient.post<ResponseData<PagedData<CertificateRequest>>>
     (`${environment.apiUrl}/certificate-request/search`, body, this.option);
  }
}
