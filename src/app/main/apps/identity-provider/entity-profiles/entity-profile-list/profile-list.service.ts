import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Profile } from 'app/main/models/Profile';
import { environment } from 'environments/environment';
import { PagedData } from 'app/main/models/PagedData';
import { ResponseData } from 'app/main/models/ResponseData';
@Injectable({
  providedIn: 'root'
})
export class ProfileListService {
  public onUserListChanged: BehaviorSubject<any>;
  /**
   * Constructor
   *
   * @param {HttpClient} _httpClient
   */
  constructor(
      private _httpClient: HttpClient,
      ) {
    // Set the defaults
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
  public getListProfiles(): Observable<ResponseData<PagedData<Profile>>>{

    const body = {
      "page" : 0,
    "size" : 10,
    "sort" : [],
    "contains" : "",
    "fromDate":"",
    "toDate":""
    }
    return this._httpClient.post<any>(`${environment.apiUrl}/entity-profile/list`,body,this.option);
  }
}
