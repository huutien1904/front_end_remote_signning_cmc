import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  AddressFull,
  Commune,
  District,
  Province,
  Street,
} from 'app/main/models/Address';
import { Organization } from 'app/main/models/Organization';
import { Personal } from 'app/main/models/Personal';
import { ResponseData } from 'app/main/models/ResponseData';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OrganizationEditService {
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
  constructor(private _httpClient: HttpClient) {}

  public getOrganizationId(id): Observable<ResponseData<Organization>> {
    return this._httpClient.get<ResponseData<Organization>>(
      `${environment.apiUrl}/organization/${id}`,
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
  public getAddressById(id): Observable<ResponseData<AddressFull>> {
    return this._httpClient.get<ResponseData<AddressFull>>(
      `${environment.apiUrl}/address/${id}`,
      this.option
    );
  }

  public getProvince(): Observable<ResponseData<Province[]>> {
    return this._httpClient.get<ResponseData<Province[]>>(
      `${environment.apiUrl}/address/allProvince`,
      this.option
    );
  }

  public getDistrict(idProvince): Observable<ResponseData<District[]>> {
    return this._httpClient.get<ResponseData<District[]>>(
      `${environment.apiUrl}/address/districtByProvince/${idProvince}`,
      this.option
    );
  }

  public getCommune(idDistrict): Observable<ResponseData<Commune[]>> {
    return this._httpClient.get<ResponseData<Commune[]>>(
      `${environment.apiUrl}/address/communeByDistrict/${idDistrict}`,
      this.option
    );
  }

  public getStreet(idCommune): Observable<ResponseData<Street[]>> {
    return this._httpClient.get<ResponseData<Street[]>>(
      `${environment.apiUrl}/address/streetByCommune/${idCommune}`,
      this.option
    );
  }

  public createStreet(body): Observable<ResponseData<Street>> {
    return this._httpClient.post<ResponseData<Street>>(
      `${environment.apiUrl}/address/street/create`,
      body,
      this.option
    );
  }
  public createCommune(body): Observable<ResponseData<Commune>> {
    return this._httpClient.post<ResponseData<Commune>>(
      `${environment.apiUrl}/address/commune/create`,
      body,
      this.option
    );
  }
  public createDistrict(body): Observable<ResponseData<District>> {
    return this._httpClient.post<ResponseData<District>>(
      `${environment.apiUrl}/address/district/create`,
      body,
      this.option
    );
  }
  public createProvince(body): Observable<ResponseData<Province>> {
    return this._httpClient.post<ResponseData<Province>>(
      `${environment.apiUrl}/address/province/create`,
      body,
      this.option
    );
  }

  updateOrganization(body): Observable<ResponseData<Personal>> {
    console.log('test');
    console.log(body);

    return this._httpClient.put<ResponseData<Personal>>(
      `${environment.apiUrl}/organization/update`,
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
