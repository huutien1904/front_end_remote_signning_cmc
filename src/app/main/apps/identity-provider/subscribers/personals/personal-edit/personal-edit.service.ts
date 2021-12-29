import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Personal } from 'app/main/models/Personal';
import { ResponseData } from 'app/main/models/ResponseData';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PersonalEditService {

constructor(private _httpClient: HttpClient) { }
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
public getPersonalById(id): Observable<ResponseData<Personal>> {
  return this._httpClient.get<ResponseData<Personal>>(
    `${environment.apiUrl}/staff/${id}`,
    this.option
  );
}
// public updateProfileId(id, body): Observable<ResponseData<Personal>> {
//   return this._httpClient.post<ResponseData<Personal>>(
//     `${environment.apiUrl}/entity-profile/${id}`,body,
//     this.option
//   );
// }
}
