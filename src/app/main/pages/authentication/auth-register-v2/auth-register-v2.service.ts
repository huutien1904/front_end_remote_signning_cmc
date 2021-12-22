import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthRegisterV2Service {

  constructor(private _http: HttpClient) { }
  private option = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  registerReq(body): Observable<any> {
    return this._http.post<any>(`${environment.apiUrl}/user/register`, body,this.option);
  }

}
