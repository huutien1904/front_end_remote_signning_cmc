import { Organization } from 'app/main/models/Organization';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PagedData } from 'app/main/models/PagedData';
import { Personal, PersonalDetail } from 'app/main/models/Personal';
import { ResponseData } from 'app/main/models/ResponseData';
import { environment } from 'environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
@Injectable()
export class PersonalService {
  // public
  public onUserListChanged: BehaviorSubject<any>;

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

  /**
   * Constructor
   * @param {HttpClient} _httpClient
   */
  constructor(private _httpClient: HttpClient) {
    // Set the defaults
    this.onUserListChanged = new BehaviorSubject({});
  }

  public submitForm(body): Observable<any> {
    return this._httpClient.post<any>(
      `${environment.apiUrl}/staff/create`,
      body,
      this.option
    );
  }
  public createListPersonal(body): Observable<any> {
    console.log('body', body, 'option : ', this.option);
    return this._httpClient.post<any>(
      `${environment.apiUrl}/staff/create-list-staff`,
      body,
      this.option
    );
  }
  public getOrganizationId(): Observable<any> {
    return this._httpClient.get<ResponseData<PagedData<Organization>>>(
      `${environment.apiUrl}/organization/get-all`,
      this.option
    );
  }

  getData(
    page: number,
    Item: number
  ): Observable<ResponseData<PagedData<Personal>>> {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const token = currentUser.token;
    const param = new HttpParams({ fromObject: { page: page, size: Item } });
    const option = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
      params: param,
    };
    return this._httpClient.get<ResponseData<PagedData<Personal>>>(
      `${environment.apiUrl}/personal/list`,
      option
    );
  }

  public getListPersonals(body): Observable<ResponseData<PagedData<Personal>>> {
    return this._httpClient.post<ResponseData<PagedData<Personal>>>(
      `${environment.apiUrl}/staff/search`,
      body,
      this.option
    );
  }

  public searchPersonal(body): Observable<ResponseData<PagedData<Personal>>> {
    return this._httpClient.post<ResponseData<PagedData<Personal>>>(
      `${environment.apiUrl}/staff/search`,
      body
    );
  }
  public deletePersonal(staffId): Observable<ResponseData<Personal>> {
    return this._httpClient.delete<ResponseData<Personal>>(
      `${environment.apiUrl}/staff/${staffId}`,
      this.option
    );
  }

  public getPersonalById(id): Observable<ResponseData<Personal>> {
    return this._httpClient.get<ResponseData<Personal>>(
      `${environment.apiUrl}/staff/${id}`,
      this.option
    );
  }

  getDetailPersonal(id: string): Observable<ResponseData<PersonalDetail>> {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const token = currentUser.token;
    const option = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
    };
    return this._httpClient.get<ResponseData<PersonalDetail>>(
      `${environment.apiUrl}/personal/view/${id}`,
      option
    );
  }

  updatePersonal(body): Observable<ResponseData<Personal>> {
    console.log('test');
    console.log(body);

    return this._httpClient.put<ResponseData<Personal>>(
      `${environment.apiUrl}/staff/update`,
      body,
      this.option
    );
  }
  createPersonalSelf(body): Observable<ResponseData<Personal>> {
    return this._httpClient.post<ResponseData<Personal>>(
      `${environment.apiUrl}/staff/create-self`,
      body,
      this.option
    );
  }
  updateRole(body): Observable<any> {
    return this._httpClient.put<any>(
      `${environment.apiUrl}/role/update`,
      body,
      this.option
    );
  }
  getRole(username: string): Observable<any> {
    return this._httpClient.get<any>(
      `${environment.apiUrl}/role/${username}`,
      this.option
    );
  }
}
