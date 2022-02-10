import { HttpClient } from '@angular/common/http';
import { Template } from '@angular/compiler/src/render3/r3_ast';
import { Injectable } from '@angular/core';
import { PagedData } from 'app/main/models/PagedData';
import { ResponseData } from 'app/main/models/ResponseData';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TemplateService {

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
  constructor(private _httpClient: HttpClient) { }

  public getListTemplate(body): Observable<ResponseData<PagedData<Template>>> {
    return this._httpClient.post<ResponseData<PagedData<Template>>>(
      `${environment.apiUrl}/keypair/search`,
      body,
      this.option
    );
  }
}
