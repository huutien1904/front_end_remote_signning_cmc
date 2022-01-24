import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AddressFull, Province } from 'app/main/models/Address';
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
  public getAddressById(id):Observable<ResponseData<AddressFull>>{
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
  
}
