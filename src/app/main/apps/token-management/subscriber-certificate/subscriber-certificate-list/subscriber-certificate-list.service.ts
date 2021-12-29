import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import * as forge from 'node-forge';
import { FormGroup } from '@angular/forms';
import { SubscriberCertificate } from 'app/main/models/SubscriberCertificate';
import { PagedData } from 'app/main/models/PagedData';
import { ResponseData } from 'app/main/models/ResponseData';
import { CertificateRequest } from 'app/main/models/CertificateRequest';

@Injectable({
  providedIn: 'root',
})
export class SubscriberCertificateListService {
  constructor(private _httpClient: HttpClient) {}

  // option
  private readonly currentUser = JSON.parse(
    localStorage.getItem('currentUser')
  );
  private readonly token = this.currentUser.token;
  private option = {
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + this.token,
    },
  };
  readCertificate(cer): any[] {
    //decode
    let read: any = forge.pki.certificateFromPem(
      '-----BEGIN CERTIFICATE-----\r\n' +
        cer +
        '\r\n-----END CERTIFICATE-----\r\n'
    );

    //get attributes
    read = read.subject.attributes;

    //dich tieng Viet
    let res: any[] = JSON.parse(forge.util.decodeUtf8(JSON.stringify(read)));
    return res;
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
    >(`${environment.apiUrl}/subscriber-certificate/search`, body, option);
  }

  updateCert(form: FormGroup): Observable<ResponseData<PagedData<CertificateRequest>>> {
    const formData = new FormData();
    formData.append('keypairId', form.get('keypairId').value);
    formData.append('certificate', form.get('fileSource').value);
    formData.append(
      'certificateRequestId',
      form.get('certificateRequestId').value
    );

    formData.append('caId', form.get('caId').value);
    console.log(formData.get('keypairId'));
    console.log(formData);
    console.log(form.value);
    const option = {
      headers: {
        Authorization: 'Bearer ' + this.token,
      },
    };
    return this._httpClient.post<any>(
      `${environment.apiUrl}/subscriber-certificate/update`,
      formData,
      option
    );
  }
}
