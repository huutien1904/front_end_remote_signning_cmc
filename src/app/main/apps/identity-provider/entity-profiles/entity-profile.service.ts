import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { PagedData } from "app/main/models/PagedData";
import { EntityProfile } from "app/main/models/EntityProfile";
import { ResponseData } from "app/main/models/ResponseData";
import { environment } from "environments/environment";
import { Observable } from "rxjs";
import { Organization } from "app/main/models/Organization";

@Injectable({
  providedIn: "root",
})
export class EntityProfileService {
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
  public getListProfiles(body): Observable<ResponseData<PagedData<EntityProfile>>> {
    return this._httpClient.post<ResponseData<PagedData<EntityProfile>>>(
      `${environment.apiUrl}/entity-profile/list`,body,
      this.option
    );
  }

  public createProfile(body): Observable<ResponseData<EntityProfile[]>> {
    return this._httpClient.post<ResponseData<EntityProfile[]>>(
      `${environment.apiUrl}/entity-profile/create`,body,
      this.option
    );
  }
  public getProfileId(id): Observable<ResponseData<EntityProfile>> {
    return this._httpClient.get<ResponseData<EntityProfile>>(
      `${environment.apiUrl}/entity-profile/${id}`,
      this.option
    );
  }
  public deleteProfileId(id): Observable<any> {
    return this._httpClient.delete<any>(
      `${environment.apiUrl}/entity-profile/${id}`,
      this.option
    );
  }
  public getAllOrganizations(): Observable<any> {
    return this._httpClient.get<ResponseData<PagedData<Organization>>>(
      `${environment.apiUrl}/organization/get-all`,
      this.option
    );
  }
  public updateProfileId(id, body): Observable<ResponseData<EntityProfile>> {
    return this._httpClient.post<ResponseData<EntityProfile>>(
      `${environment.apiUrl}/entity-profile/${id}`,body,
      this.option
    );
  }
  
  // get detail subject DN by staffId and profileID
  public getSubjectDnById(profileID,staffID): Observable<ResponseData<any>> {
    return this._httpClient.get<ResponseData<any>>(
      `${environment.apiUrl}/subscriber-certificate/dn/${profileID}/${staffID}`,
      this.option
    );
  }
}
