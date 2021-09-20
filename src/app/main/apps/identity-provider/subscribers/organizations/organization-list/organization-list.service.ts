import { Injectable } from '@angular/core';
import { HttpClient,HttpParams } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { PagedData } from 'app/main/models/PagedData';
import { Organization } from 'app/main/models/Organization';
import { ResponseData } from 'app/main/models/ResponseData';
import { environment } from 'environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class OrganizationListService {
  public rows: any;
  public onUserListChanged: BehaviorSubject<any>;
   /**
   * Constructor
   *
   * @param {HttpClient} _httpClient
   */
    constructor(private _httpClient: HttpClient) {
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
    public getListOrganizations(page:PagedData<Organization>) :Observable<ResponseData<PagedData<Organization>>>{
      const currentUser = JSON.parse(localStorage.getItem('currentUser'));
      const token = currentUser.token;
      const param = new HttpParams({fromObject: {page: page.currentPage, size: page.size}});
      console.log("service organization list");
      const option = {
        headers :{
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token,
        },
        params:param
      };
       return this._httpClient.get<ResponseData<PagedData<Organization>>>(`http://183.91.3.60:8080/csignremote-0.2/organization/list`,option);
    }
    public submitForm(body): Observable<any> {
      return this._httpClient.post<any>(
        `${environment.apiUrl}/organization/create`,body,
        this.option
      );
    }
}
