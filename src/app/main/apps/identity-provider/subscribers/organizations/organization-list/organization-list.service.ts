import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';
import { PagedData } from 'app/main/models/PagedData';
import {
  Organization,
  OrganizationCategory,
} from 'app/main/models/Organization';
import { ResponseData } from 'app/main/models/ResponseData';
import { environment } from 'environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class OrganizationListService {
  // public
  public rows: any;
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

  // option
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

  public searchOrganizations(
    body
  ): Observable<ResponseData<PagedData<Organization>>> {
    return this._httpClient.post<ResponseData<PagedData<Organization>>>(
      `${environment.apiUrl}/organization/search`,
      body,
      this.option
    );
  }

  public getAllOrganizations(): Observable<any> {
    return this._httpClient.get<ResponseData<PagedData<Organization>>>(
      `${environment.apiUrl}/organization/get-all`,
      this.option
    );
  }

  public submitForm(body): Observable<any> {
    return this._httpClient.post<any>(
      `${environment.apiUrl}/organization/create`,
      body,
      this.option
    );
  }

  public getListOrganizationCategory(): Observable<
    ResponseData<PagedData<OrganizationCategory>>
  > {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const token = currentUser.token;
    const option = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
    };
    return this._httpClient.get<ResponseData<PagedData<OrganizationCategory>>>(
      `${environment.apiUrl}/subscriber-category/list`,
      this.option
    );
  }
  public deleteOrganization(id): Observable<ResponseData<Organization>> {
    let body = {
      organizationId: id,
    };
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const token = currentUser.token;
    const option = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
      body: body,
    };
    return this._httpClient.delete<ResponseData<Organization>>(
      `${environment.apiUrl}/organization/delete`,
      option
    );
  }
  getListSelectOrganization(): Observable<
    ResponseData<PagedData<Organization>>
  > {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const token = currentUser.token;
    const option = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
    };
    return this._httpClient.get<ResponseData<PagedData<Organization>>>(
      `${environment.apiUrl}/organization/list?page=0&size=1000`,
      this.option
    );
  }

}
