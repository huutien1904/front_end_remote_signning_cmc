import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import * as forge from 'node-forge';
import { CertificateRequest } from 'app/main/models/CertificateRequest';
import { ResponseData } from 'app/main/models/ResponseData';
import { PagedData } from 'app/main/models/PagedData';

@Injectable({
  providedIn: 'root'
})
export class CertificateRequestListService{
  // public

  public onUserListChanged: BehaviorSubject<any>;
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

  public getListCertificateRequests(body) :Observable<ResponseData<PagedData<CertificateRequest>>>{
     return this._httpClient.post<ResponseData<PagedData<CertificateRequest>>>
     (`${environment.apiUrl}/certificate-request/search`, body, this.option);
  }
}
