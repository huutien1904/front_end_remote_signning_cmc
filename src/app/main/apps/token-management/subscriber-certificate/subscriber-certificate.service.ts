import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PagedData } from 'app/main/models/PagedData';
import { ResponseData } from 'app/main/models/ResponseData';
import { SubscriberCertificate } from 'app/main/models/SubscriberCertificate';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class SubscriberCertificateService {

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
  constructor(
    private _httpClient: HttpClient,
  ) { }

  public getSubscriberCertificateById(id): Observable<ResponseData<PagedData<SubscriberCertificate>>> {
    return this._httpClient.get<ResponseData<PagedData<SubscriberCertificate>>>(
      `${environment.apiUrl}/subscriber-certificate/${id}`,
      this.option
    );
  }
  public deleteSubscriberCertificateById(id): Observable<ResponseData<PagedData<SubscriberCertificate>>> {
    return this._httpClient.delete<ResponseData<PagedData<SubscriberCertificate>>>
      (`${environment.apiUrl}/subscriber-certificate/delete-by-role/${id}`,this.option);
  }
}
