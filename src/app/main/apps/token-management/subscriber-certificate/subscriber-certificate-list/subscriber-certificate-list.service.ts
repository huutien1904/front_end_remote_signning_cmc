import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import * as forge from 'node-forge';

@Injectable({
  providedIn: 'root'
})

export class SubscriberCertificateListService {

  /**
   * Constructor
   *
   * @param {HttpClient} _httpClient
   */
  constructor(private _httpClient: HttpClient) { }
  readCertificate(cer): any[] {
    //decode
    let read: any = forge.pki.certificateFromPem("-----BEGIN CERTIFICATE-----\r\n" + cer + "\r\n-----END CERTIFICATE-----\r\n");

    //get attributes
    read = read.subject.attributes;

    //dich tieng Viet 
    let res: any[] = JSON.parse( forge.util.decodeUtf8( JSON.stringify(read)));
    return res;
  }
  getData(page:number,Item:number): Observable<any[]>{
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const token = currentUser.token;
    const option = {
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
      },
    };
    return this._httpClient.get<any>(`${environment.apiUrl}/subscriber-certificate/list?page=${page}&size=${Item}`, option);
  }
}
