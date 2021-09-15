import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import * as forge from 'node-forge';

@Injectable({
  providedIn: 'root'
})
export class CertificateRequestListService implements Resolve<any> {
  public rows: any;
  public onUserListChanged: BehaviorSubject<any>;
  public page=0;

  /**
   * Constructor
   *
   * @param {HttpClient} _httpClient
   */
  constructor(private _httpClient: HttpClient) {
    this.onUserListChanged = new BehaviorSubject({});
  }
  
  /**
   * Resolver
   *
   * @param {ActivatedRouteSnapshot} route
   * @param {RouterStateSnapshot} state
   * @returns {Observable<any> | Promise<any> | any}
   */
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return new Promise<void>((resolve, reject) => {
      Promise.all([this.getDataTableRows(this.page)]).then(() => {
        resolve();
      }, reject);
    })
    
  }

  getDataTableRows(page): Observable<any> | Promise<any> | any {
    return new Promise((resolve, reject) => {
      this._httpClient.get(`${environment.apiUrl}/certificate-request/list?page=${page}&size=10`).subscribe((response: any) => {
        this.rows = response;
        console.log(response.data.data);
        this.onUserListChanged.next(this.rows);
        resolve(this.rows);
      }, reject);
    });
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

  getData(page:number,Item:number): Observable<any[]>{
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const token = currentUser.token;
    const option = {
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
      },
    };
    return this._httpClient.get<any>(`${environment.apiUrl}/certificate-request/list?page=${page}&size=${Item}`, option);
  }

}
