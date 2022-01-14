import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CertificateRequest } from 'app/main/models/CertificateRequest';
import { PagedData } from 'app/main/models/PagedData';
import { ResponseData } from 'app/main/models/ResponseData';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CertificateRequestService {
  // public


  /**
   * Constructor
   * @param {HttpClient} _httpClient
   */

  // option
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
  constructor(
    private _httpClient: HttpClient,

  ) { }

  public getListCertificateRequest(body): Observable<ResponseData<PagedData<CertificateRequest>>> {
    return this._httpClient.post<ResponseData<PagedData<CertificateRequest>>>
      (`${environment.apiUrl}/certificate-request/list`, body, this.option);
  }
  public getCertificateRequestById(id): Observable<ResponseData<PagedData<CertificateRequest>>> {
    return this._httpClient.get<ResponseData<PagedData<CertificateRequest>>>
      (`${environment.apiUrl}/certificate-request/${id}`, this.option);
  }
}
