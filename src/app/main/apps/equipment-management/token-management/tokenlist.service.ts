import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ResponseData } from "app/main/models/response-data";
import { environment } from "environments/environment";
import {  Observable } from "rxjs";
import { Token } from 'app/main/models/Equipment'

@Injectable({
  providedIn: 'root'
})
export class TokenlistService {

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
}
