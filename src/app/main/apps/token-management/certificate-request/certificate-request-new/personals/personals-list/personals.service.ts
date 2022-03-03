import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { Keypair } from 'app/main/models/Keypair';
import { ResponseData } from 'app/main/models/ResponseData';
import { CertificateRequest } from 'app/main/models/CertificateRequest';

@Injectable()
export class PersonalsService {
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
  /**
   * Constructor
   * @param {HttpClient} _httpClient
   */
  constructor(private _httpClient: HttpClient) { }

  checkAlias(alias):Observable<any> {
    return this._httpClient.get(`${environment.apiUrl}/keypair/check?alias=${alias}`, this.option);
  }

  public createKeypair(body): Observable<ResponseData<Keypair>> {
    return this._httpClient.post<ResponseData<Keypair>>(
      `${environment.apiUrl}/keypair/create`,body,
      this.option
    );
  }
  public createCertificateRequest(body): Observable<ResponseData<CertificateRequest>> {
    return this._httpClient.post<ResponseData<CertificateRequest>>(
      `${environment.apiUrl}/certificate-request/create`,body,
      this.option
    );
  }
  public createCertificateRequestList(body): Observable<ResponseData<boolean>> {
    return this._httpClient.post<ResponseData<boolean>>(
      `${environment.apiUrl}/certificate-request/create-list`,body,
      this.option
    );
  }
}
