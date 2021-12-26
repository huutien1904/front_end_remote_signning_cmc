import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ResponseData } from 'app/main/models/ResponseData';
import { environment } from 'environments/environment';
import { Token } from 'app/main/models/Equipment';
import { BehaviorSubject, Observable } from 'rxjs';
import { PagedData } from 'app/main/models/PagedData';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  public onUserListChanged: BehaviorSubject<any>;
  public page = 0;

  constructor(private _httpClient: HttpClient) {}
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

  public getListToken(body): Observable<ResponseData<PagedData<Token>>> {
    return this._httpClient.post<ResponseData<PagedData<Token>>>(
      `${environment.apiUrl}/token/search`,
      body,
      this.option
    );
  }
  public createToken(body): Observable<ResponseData<PagedData<Token>>> {
    return this._httpClient.post<ResponseData<PagedData<Token>>>(
      `${environment.apiUrl}/token/create`,body,
      this.option
    );
  }

  

}
