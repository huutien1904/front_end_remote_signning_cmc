import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Hsm } from 'app/main/models/Equipment';
import { PagedData } from 'app/main/models/PagedData';
import { ResponseData } from 'app/main/models/ResponseData';
import { environment } from 'environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HsmService {

  public onHsmListChanged: BehaviorSubject<any>;


  constructor( private _httpClient: HttpClient) { 
    this.onHsmListChanged = new BehaviorSubject({});
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
    `${environment.apiUrl}/hsm/search`, body, this.option
  );
}


}

