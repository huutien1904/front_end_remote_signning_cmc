import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PagedData } from 'app/main/models/pagedData';
import { Personal } from 'app/main/models/personal';
import { ResponseData } from 'app/main/models/response-data';
import { environment } from 'environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { delay, map } from 'rxjs/operators';
@Injectable()
export class PersonalListService{
  public onUserListChanged: BehaviorSubject<any>;
  /**
   * Constructor
   *
   * @param {HttpClient} _httpClient
   */
  constructor(private _httpClient: HttpClient) {
    // Set the defaults
    this.onUserListChanged = new BehaviorSubject({});
  }
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

  public submitForm(body): Observable<any> {
    return this._httpClient.post<any>(
      `${environment.apiUrl}/personal/create`,body,
      this.option
    );
  }
  public getOrganizationId(): Observable<any> {
    return this._httpClient.get<any>(
      `${environment.apiUrl}/organization/list?page=0&size=1000`,
      this.option
    );
  }

  getData(page:number,Item:number): Observable<ResponseData<PagedData<Personal>>>{
    const currentUser = JSON.parse(localStorage.getItem('currentUser'))
    const token = currentUser.token;
    const param = new HttpParams({fromObject: {page: page, size: Item}});
    const option = {
      headers :{
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token,
      }, 
      params: param,
    };
    return this._httpClient.get<ResponseData<PagedData<Personal>>>(`http://183.91.3.60:8080/csignremote-0.2/personal/list`,option);
  }
  // }     

  public getListPersonals(page:PagedData<Personal>) :Observable<ResponseData<PagedData<Personal>>>{
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
     return this._httpClient.get<ResponseData<PagedData<Personal>>>(`http://183.91.3.60:8080/csignremote-0.2/personal/list`,option);
    //  .pipe(
    //   delay(new Date(Date.now() + 0)),
    //   map(d =>  d )
    // );
    
  }

}
