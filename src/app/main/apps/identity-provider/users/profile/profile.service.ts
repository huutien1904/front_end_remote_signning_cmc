import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Commune, District, Province, Street } from 'app/main/models/Address';
import { Personal } from 'app/main/models/Personal';
import { ResponseData } from 'app/main/models/ResponseData';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  //public
  // public currentUser: Observable<User>;
  // private currentUserSubject: BehaviorSubject<User>;

  constructor(private _httpClient: HttpClient) {}
  
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
  public getPersonalById(): Observable<ResponseData<Personal>> {
    
    return this._httpClient.get<ResponseData<Personal>>(
      `${environment.apiUrl}/staff/self-info`,
      this.option
    );
  }

  public getProviceById(id): Observable<ResponseData<Province>> {
    
    return this._httpClient.get<ResponseData<Province>>(
      `${environment.apiUrl}/address/province/${id}`,
      this.option
    );
  }
  public getDistrictById(id): Observable<ResponseData<District>> {
    
    return this._httpClient.get<ResponseData<District>>(
      `${environment.apiUrl}/address/district/${id}`,
      this.option
    );
  }
  public getCommuneById(id): Observable<ResponseData<Commune>> {
    
    return this._httpClient.get<ResponseData<Commune>>(
      `${environment.apiUrl}/address/comune/${id}`,
      this.option
    );
  }

  public getStreetById(id): Observable<ResponseData<Street>> {
    
    return this._httpClient.get<ResponseData<Street>>(
      `${environment.apiUrl}/address/street/${id}`,
      this.option
    );
  }

}
