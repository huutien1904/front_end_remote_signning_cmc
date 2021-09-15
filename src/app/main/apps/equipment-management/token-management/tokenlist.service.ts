import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ResponseData } from "app/main/models/response-data";
import { environment } from "environments/environment";
import { Token } from 'app/main/models/Equipment'
import { BehaviorSubject, Observable } from 'rxjs';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class TokenlistService implements Resolve<any> {
  public rows: any;
  public onUserListChanged: BehaviorSubject<any>;
  public page=0;

  constructor(private _httpClient: HttpClient) { }
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
      this._httpClient.get(`${environment.apiUrl}/token/list?page=${page}&size=10`).subscribe((response: any) => {
        this.rows = response;
        console.log(response.data.data);
        this.onUserListChanged.next(this.rows);
        resolve(this.rows);
      }, reject);
    });
  }

  public getAllToken(): Observable<ResponseData<Token[]>> {
    return this._httpClient.get<ResponseData<Token[]>>(
      `${environment.apiUrl}/token/list`,
      this.option
    );
  }
  public submitForm(body): Observable<any> {
    return this._httpClient.post<any>(
      `${environment.apiUrl}/token/create`,body,
      this.option
    );
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
    return this._httpClient.get<any>(`${environment.apiUrl}/token/list?page=${page}&size=${Item}`, option);
  }
}
