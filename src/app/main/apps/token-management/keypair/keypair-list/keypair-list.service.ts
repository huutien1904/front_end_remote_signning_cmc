import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Keypair } from 'app/main/models/Keypair';
import { PagedData } from 'app/main/models/PagedData';
import { ResponseData } from 'app/main/models/ResponseData';
import { environment } from 'environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class KeypairListService {
  public onUserListChanged: BehaviorSubject<any>;
  /**
   * Constructor
   *
   * @param {HttpClient} _httpClient
   */
     constructor(private _httpClient: HttpClient) {
      this.onUserListChanged = new BehaviorSubject({});
    }

    // option
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
  public getData(body) :Observable<ResponseData<PagedData<Keypair>>>{
    console.log(body)
    return this._httpClient.post<ResponseData<PagedData<Keypair>>>
    (`${environment.apiUrl}/keypair/search`,body,this.option);
  }

  public deleteKeypairById(id): Observable<ResponseData<PagedData<Keypair>>> {
    return this._httpClient.delete<ResponseData<PagedData<Keypair>>>
      (`${environment.apiUrl}/keypair/delete-by-role/${id}`,this.option);
  }

}
