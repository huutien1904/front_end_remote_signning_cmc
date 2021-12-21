import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { PagedData } from "app/main/models/PagedData";
import { Profile } from "app/main/models/Profile";
import { ResponseData } from "app/main/models/ResponseData";
import { environment } from "environments/environment";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ProfileService {
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
  public getListProfiles(form, page:PagedData<Profile>): Observable<ResponseData<PagedData<Profile>>> {
    const body ={
        page : page.currentPage,
        size : page.size,
        sort : [],
        contains : form.contains,
        fromDate : form.fromDate,
        toDate : form.toDate
    }
    ;
    return this._httpClient.post<ResponseData<PagedData<Profile>>>(
      `${environment.apiUrl}/entity-profile/list`,body,
      this.option
    );
  }

  public createProfile(body): Observable<ResponseData<Profile[]>> {
    return this._httpClient.post<ResponseData<Profile[]>>(
      `${environment.apiUrl}/entity-profile/create`,body,
      this.option
    );
  }
  public getProfileId(id): Observable<ResponseData<Profile>> {
    return this._httpClient.get<ResponseData<Profile>>(
      `${environment.apiUrl}/entity-profile/${id}`,
      this.option
    );
  }
}