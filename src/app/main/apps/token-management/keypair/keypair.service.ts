import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Keypair } from "app/main/models/Keypair";
import { PagedData } from "app/main/models/PagedData";
import { ResponseData } from "app/main/models/ResponseData";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class KeypairService {
  constructor(private _httpClient: HttpClient) {}

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

  getKeypairList(
    subscriberId: string,
    page: PagedData<Keypair>
  ): Observable<ResponseData<PagedData<Keypair>>> {
    const param = new HttpParams({fromObject: {page: page.currentPage, size: page.size}});
    const option = {
      headers :{
        "Content-Type": "application/json",
        "Authorization": "Bearer " + this.token,
      },
      params:param
    };
    console.log("Keypair service");
    
    return this._httpClient.get<ResponseData<PagedData<Keypair>>>(`http://183.91.3.60:8080/csignremote-0.2/keypair/list/${subscriberId}`,option);
  }
}
