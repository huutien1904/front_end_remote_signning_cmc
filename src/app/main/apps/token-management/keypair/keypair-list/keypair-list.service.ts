import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Keypair } from 'app/main/models/Keypair';
import { PagedData } from 'app/main/models/PagedData';
import { ResponseData } from 'app/main/models/ResponseData';
import { environment } from 'environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
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

  public getData(page:PagedData<Keypair>, subscriberId) :Observable<ResponseData<PagedData<Keypair>>>{
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const token = currentUser.token;
    const param = new HttpParams({fromObject: {page: page.currentPage, size: page.size}});
    console.log("service personal list");
    const option = {
      headers :{
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token,
      },
      params:param
    };
     return this._httpClient.get<ResponseData<PagedData<Keypair>>>(`${environment.apiUrl}/keypair/list/${subscriberId}`,option);
  }
}
