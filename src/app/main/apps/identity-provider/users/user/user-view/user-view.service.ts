import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';

import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'environments/environment';

@Injectable()
export class UserViewService implements Resolve<any> {
  public rows: any;
  public onUserViewChanged: BehaviorSubject<any>;
  public id;

  /**
   * Constructor
   *
   * @param {HttpClient} _httpClient
   */
  constructor(private _httpClient: HttpClient) {
    // Set the defaults
    this.onUserViewChanged = new BehaviorSubject({});
  }

  /**
   * Resolver
   *
   * @param {ActivatedRouteSnapshot} route
   * @param {RouterStateSnapshot} state
   * @returns {Observable<any> | Promise<any> | any}
   */
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    let currentId = String(route.paramMap.get('id'));
    return new Promise<void>((resolve, reject) => {
      Promise.all([this.getApiData(currentId)]).then(() => {
        resolve();
      }, reject);
    });
  }

  /**
   * Get rows
   */
  getApiData(id: string): Promise<any[]> {
    const url = `${environment.apiUrl}/user/view/${id}`;
    const option = {
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJodW5naHVzdFNBIiwicm9sZSI6W3siYXV0aG9yaXR5IjoiUk9MRV9TVVBFUkFETUlOIn1dLCJleHAiOjE3MDgzMTIwNDAsImlhdCI6MTYyMTkxMjA0MH0.TASpxR72xP8nMGt9NUEl2R6w4Gdcqc86A-T75s_1Z1Fdjq92kcnKFTCcTeS96VjuV-VnyMR2dA2-r1vI7PQ1vQ"
      }
    };
    return new Promise((resolve, reject) => {
      this._httpClient.get(url, option).subscribe((response: any) => {
        this.rows = response.data;
        console.log(response.data);
        this.onUserViewChanged.next(this.rows);
        resolve(this.rows);
      }, reject);
    });
  }
}