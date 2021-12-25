import { Organization } from 'app/main/models/Organization';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PagedData } from 'app/main/models/PagedData';
import { Personal } from 'app/main/models/Personal';
import { ResponseData } from 'app/main/models/ResponseData';
import { environment } from 'environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
@Injectable()

export class PersonalListService {
  // public 
  public onUserListChanged: BehaviorSubject<any>;

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

  /**
   * Constructor
   * @param {HttpClient} _httpClient
   */
  constructor(
    private _httpClient: HttpClient,
  ) {
    // Set the defaults
    this.onUserListChanged = new BehaviorSubject({});
  }

  
  public submitForm(body): Observable<any> {
    return this._httpClient.post<any>(
      `${environment.apiUrl}/personal/create`, body,
      this.option
    );
  }
  public createListPersonal(body): Observable<any> {
    console.log("body", body, "option : ", this.option);
    return this._httpClient.post<any>(
      `${environment.apiUrl}/staff/create-list-staff`, body,
      this.option
    );
  }
  public getOrganizationId(): Observable<any> {
    return this._httpClient.get<ResponseData<PagedData<Organization>>>(
      `${environment.apiUrl}/organization/list?page=0&size=1000`,
      this.option
    );
  }

  getData(page: number, Item: number): Observable<ResponseData<PagedData<Personal>>> {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'))
    const token = currentUser.token;
    const param = new HttpParams({ fromObject: { page: page, size: Item } });
    const option = {
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token,
      },
      params: param,
    };
    return this._httpClient.get<ResponseData<PagedData<Personal>>>(`${environment.apiUrl}/personal/list`, option);
  }

  public getListPersonals(body): Observable<ResponseData<PagedData<Personal>>> {
    return this._httpClient.post<ResponseData<PagedData<Personal>>>
    (`${environment.apiUrl}/staff/search`,body, this.option);
  }
  
  public searchPersonal(page: PagedData<Personal>, body): Observable<ResponseData<PagedData<Personal>>> {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const token = currentUser.token;
    console.log(token)
    const param = new HttpParams({ fromObject: { page: page.currentPage, size: page.size } });
    console.log("service personal list");
    const option = {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      // params:param
    };
    return this._httpClient.post<ResponseData<PagedData<Personal>>>(`${environment.apiUrl}/staff/search`, body, option);
  }
  public deletePersonal(personalId): Observable<Object> {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const token = currentUser.token;
    console.log("service personal list");
    const option = {
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token,
      },
    };
    return this._httpClient.delete(`${environment.apiUrl}/personal/delete/${personalId}`, option);
  }

}
