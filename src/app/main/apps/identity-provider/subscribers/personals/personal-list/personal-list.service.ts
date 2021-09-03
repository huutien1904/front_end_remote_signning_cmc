import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';

import { BehaviorSubject, Observable } from 'rxjs';
import { catchError,tap,map } from 'rxjs/operators';
// import {of} from 'rxjs/observable/of'
import { of } from 'rxjs';
@Injectable()
export class PersonalListService implements Resolve<any> {
  public rows: any;
  public onUserListChanged: BehaviorSubject<any>;
  page=0
  /**
   * Constructor
   *
   * @param {HttpClient} _httpClient
   */
  constructor(private _httpClient: HttpClient) {
    // Set the defaults
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

  /**
   * Get rows
   */
  getDataTableRows(page): Observable<any> | Promise<any> | any {
    return new Promise((resolve, reject) => {
      this._httpClient.get(`http://183.91.3.60:8080/csignremote-0.3/personal/list?page=${page}&size=10`).subscribe((response: any) => {
        this.rows = response;
        console.log(response.data.data);
        this.onUserListChanged.next(this.rows);
        resolve(this.rows);
      }, reject);
    });
  }

  getData(page:number,Item:number): Observable<any[]>{
    const currentUser = JSON.parse(localStorage.getItem('currentUser'))
    const token = currentUser.token
    const option = {
      headers :{
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token,
      }
    }
    // this.districtBirthPlace=[]
    return this._httpClient.get<any>(`http://183.91.3.60:8080/csignremote-0.3/personal/list?page=${page}&size=${Item}`,option)
    
  }
  // }     
}
