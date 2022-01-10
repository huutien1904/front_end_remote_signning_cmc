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

  public getTokenId(id): Observable<ResponseData<Token>> {
    console.log(id)
    return this._httpClient.get<ResponseData<Token>>(
      `${environment.apiUrl}/token/${id}`,
      this.option
    );
  }
  public deleteTokenId(id): Observable<any> {
    return this._httpClient.delete<any>(
      `${environment.apiUrl}/token/${id}`,
      this.option
    );
  }
  public updateTokenId(id, body): Observable<ResponseData<Token>> {
    return this._httpClient.post<ResponseData<Token>>(
      `${environment.apiUrl}/token/${id}`,body,
      this.option
    );
  }

  

}
