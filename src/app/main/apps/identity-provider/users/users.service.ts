import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Commune, District, Province, Street } from 'app/main/models/Address';
import { Personal } from 'app/main/models/Personal';
import { ResponseData } from 'app/main/models/ResponseData';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class UsersService {
  //public
  // public currentUser: Observable<User>;
  // private currentUserSubject: BehaviorSubject<User>;

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
  public getStaffSelf(): Observable<ResponseData<Personal>> {
    return this._httpClient.get<ResponseData<Personal>>(
      `${environment.apiUrl}/staff/self-info`,
      this.option
    );
  }

  updateSelfStaff(body):Observable<ResponseData<Personal>>{
    return this._httpClient.put<ResponseData<Personal>>(`${environment.apiUrl}/staff/update-self`, body, this.option);

  }

}
