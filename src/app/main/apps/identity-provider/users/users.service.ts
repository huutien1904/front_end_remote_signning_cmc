import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Commune, District, Province, Street } from 'app/main/models/Address';
import { CertificateRequest } from 'app/main/models/CertificateRequest';
import { Keypair } from 'app/main/models/Keypair';
import { PagedData } from 'app/main/models/PagedData';
import { Personal } from 'app/main/models/Personal';
import { ResponseData } from 'app/main/models/ResponseData';
import { SubscriberCertificate } from 'app/main/models/SubscriberCertificate';
import { environment } from 'environments/environment';
import * as forge from 'node-forge';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class UsersService {
  //public
  // public currentUser: Observable<User>;
  // private currentUserSubject: BehaviorSubject<User>;

  constructor(private _httpClient: HttpClient) {}

  private readonly currentUser = JSON.parse(
    localStorage.getItem('currentUser')
  );

  private readonly token = this.currentUser.token;

  private option = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + this.token,
    },
  };
  public getStaffSelf(): Observable<ResponseData<Personal>> {
    return this._httpClient.get<ResponseData<Personal>>(
      `${environment.apiUrl}/staff/self-info`,
      this.option
    );
  }

  updateSelfStaff(body): Observable<ResponseData<Personal>> {
    return this._httpClient.put<ResponseData<Personal>>(
      `${environment.apiUrl}/staff/update-self`,
      body,
      this.option
    );
  }
  getListSubscriberCertificates(
    body
  ): Observable<ResponseData<PagedData<SubscriberCertificate>>> {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const token = currentUser.token;
    const option = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
    };
    return this._httpClient.post<
      ResponseData<PagedData<SubscriberCertificate>>
    >(
      `${environment.apiUrl}/subscriber-certificate/search-by-current-user`,
      body,
      option
    );
  }
  public getListCertificateRequests(
    body
  ): Observable<ResponseData<PagedData<CertificateRequest>>> {
    return this._httpClient.post<ResponseData<PagedData<CertificateRequest>>>(
      `${environment.apiUrl}/certificate-request/search-by-curent-user`,
      body,
      this.option
    );
  }
  updateCert(
    form: FormGroup
  ): Observable<ResponseData<PagedData<CertificateRequest>>> {
    const formData = new FormData();
    formData.append('userId', form.get('userId').value);
    formData.append('certificateContent', form.get('certificateContent').value);

    console.log(formData);
    console.log(form.value);
    const option = {
      headers: {
        Authorization: 'Bearer ' + this.token,
      },
    };
    return this._httpClient.post<any>(
      `${environment.apiUrl}/subscriber-certificate/update-self`,
      formData,
      option
    );
  }

  readCertificate(cer): any[] {
    //decode
    let read: any = forge.pki.certificationRequestFromPem(cer);
    //get attributes
    read = read.subject.attributes;

    //dich tieng Viet
    let res: any[] = JSON.parse(forge.util.decodeUtf8(JSON.stringify(read)));

    return res;
  }
  checkAlias(alias): Observable<any> {
    return this._httpClient.get(
      `${environment.apiUrl}/keypair/check?alias=${alias}`,
      this.option
    );
  }
  public createKeypair(body): Observable<ResponseData<Keypair>> {
    return this._httpClient.post<ResponseData<Keypair>>(
      `${environment.apiUrl}/keypair/create`,
      body,
      this.option
    );
  }
  public createCertificateRequest(
    body
  ): Observable<ResponseData<CertificateRequest>> {
    return this._httpClient.post<ResponseData<CertificateRequest>>(
      `${environment.apiUrl}/certificate-request/create-self`,
      body,
      this.option
    );
  }
}
