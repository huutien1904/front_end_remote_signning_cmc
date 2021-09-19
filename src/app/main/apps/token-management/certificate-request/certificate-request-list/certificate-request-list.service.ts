import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import * as forge from 'node-forge';
import { certificateRequest } from 'app/main/models/certificateRequest';
import { ResponseData } from 'app/main/models/response-data';
import { PagedData } from 'app/main/models/pagedData';

@Injectable({
  providedIn: 'root'
})
export class CertificateRequestListService{
  public onUserListChanged: BehaviorSubject<any>;
  /**
   * Constructor
   *
   * @param {HttpClient} _httpClient
   */
  constructor(private _httpClient: HttpClient) {
    this.onUserListChanged = new BehaviorSubject({});
  }

  readCertificate(cer): any[] {
    //decode
    let read: any = forge.pki.certificationRequestFromPem(cer);
    //get attributes
    read = read.subject.attributes;

    //dich tieng Viet 
    let res: any[] = JSON.parse( forge.util.decodeUtf8( JSON.stringify(read)));
    return res;
  }

  public getData(page:PagedData<certificateRequest>) :Observable<ResponseData<PagedData<certificateRequest>>>{
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const token = currentUser.token;
    const param = new HttpParams({fromObject: {page: page.currentPage, size: page.size}});
    console.log("service personal list");
    const option = {
      headers :{
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token,
      },
      params:param
    };
     return this._httpClient.get<ResponseData<PagedData<certificateRequest>>>(`${environment.apiUrl}/certificate-request/list`,option);
  }

}
