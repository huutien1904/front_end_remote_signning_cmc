import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ResponseData } from "app/main/models/response-data";
import { environment } from "environments/environment";
import { Hsm, Token } from 'app/main/models/Equipment'
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HsmlistService {
  public onUserListChanged: BehaviorSubject<any>;
  public page=0;

  constructor(private _httpClient: HttpClient) { 
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

  public getAllHsm(): Observable<ResponseData<Hsm[]>> {
    return this._httpClient.get<ResponseData<Hsm[]>>(
      `${environment.apiUrl}/hsm/list`,
      this.option
    );
  }
  public submitForm(body): Observable<any> {
    return this._httpClient.post<any>(
      `${environment.apiUrl}/hsm/create`,body,
      this.option
    );
  }
  getData(page:number,Item:number): Observable<ResponseData<Hsm[]>>{
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const token = currentUser.token;
    const option = {
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
      },
    };
    return this._httpClient.get<any>(`${environment.apiUrl}/hsm/list?page=${page}&size=${Item}`, option);
  }
  getHsmDetail(hsmId: string): Observable<ResponseData<Token[]>>{
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const token = currentUser.token;
    const option = {
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
      },
    };
    return this._httpClient.get<any>(`${environment.apiUrl}/token/list?hsmId=${hsmId}`, option);
  }
}
