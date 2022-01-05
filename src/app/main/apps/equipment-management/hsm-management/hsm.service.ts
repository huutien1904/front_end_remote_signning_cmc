import { HttpClient } from "@angular/common/http";
import { Injectable, SkipSelf } from "@angular/core";
import { ResponseData } from "app/main/models/ResponseData";
import { environment } from "environments/environment";
import { Hsm, Token } from 'app/main/models/Equipment'
import { BehaviorSubject, Observable } from 'rxjs';
import { PagedData } from "app/main/models/PagedData";

@Injectable({
  providedIn: 'root'
})
export class HsmService {
  public onUserListChanged: BehaviorSubject<any>;
  public page=0;

  constructor( private _httpClient: HttpClient) { 
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


  public getListHsm(body): Observable<ResponseData<PagedData<Hsm>>> {
    return this._httpClient.post<ResponseData<PagedData<Hsm>>>(
      `${environment.apiUrl}/hsm/search`,
      body,
      this.option
    );
  }
  public submitForm(body): Observable<ResponseData<Hsm>> {
    return this._httpClient.post<any>(
      `${environment.apiUrl}/hsm/create`,body,
      this.option
    );
  }

  public getHSMId(id): Observable<ResponseData<Hsm>> {
    return this._httpClient.get<ResponseData<Hsm>>(
      `${environment.apiUrl}/hsm/${id}`,
      this.option
    );
  }
  
  public updateHSMId(id, body): Observable<ResponseData<Hsm>> {
    return this._httpClient.post<ResponseData<Hsm>>(
      `${environment.apiUrl}/hsm/${id}`,body,
      this.option
    );
  }
  public deleteHSMId(id): Observable<any> {
    return this._httpClient.delete<any>(
      `${environment.apiUrl}/hsm/${id}`,
      this.option
    );
  }

}
