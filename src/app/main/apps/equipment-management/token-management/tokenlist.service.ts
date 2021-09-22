import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ResponseData } from "app/main/models/ResponseData";
import { environment } from "environments/environment";
import { Token } from 'app/main/models/Equipment'
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TokenlistService  {
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
  getData(page:number,Item:number): Observable<ResponseData<Token[]>>{
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
