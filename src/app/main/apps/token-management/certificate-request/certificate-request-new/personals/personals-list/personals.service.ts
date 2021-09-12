import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PersonalsService {
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
  /**
   * Constructor
   * @param {HttpClient} _httpClient
   */
  constructor(private _httpClient: HttpClient) { }

  checkAlias(alias): any {
    return this._httpClient.get(`${environment.apiUrl}/certificate-request/check?alias=${alias}`, this.option).subscribe((res: any) => {
      res = res.data;
    });
  }

  public submitForm(body): Observable<any> {
    return this._httpClient.post<any>(
      `${environment.apiUrl}/certificate-request/create`,body,
      this.option
    );
  }
}
