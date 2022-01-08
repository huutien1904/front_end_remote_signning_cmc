import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ResponseData } from "app/main/models/ResponseData";
import { environment } from "environments/environment";
import { Observable } from "rxjs";
import { Commune, District, Province, Street } from "../../models/Address";

@Injectable({
  providedIn: "root",
})
export class AddressService {
  //Test behavior
  // onAddressChanged: BehaviorSubject<ResponseData<Province[]>>;
  constructor(private _httpClient: HttpClient) {
    // this.onAddressChanged = new BehaviorSubject(null);
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

  public getProvince(): Observable<ResponseData<Province[]>> {
    return this._httpClient.get<ResponseData<Province[]>>(
      `${environment.apiUrl}/address/allProvince`,
      this.option
    );
    /**
     * Behavior đọc trong document, service này chưa cần dùng
     */
    // return new Observable<ResponseData<Province[]>>((observers) => {
    //   return this._httpClient.get<ResponseData<Province[]>>(
    //       `${environment.apiUrl}/address/province/list/${idCountry}`,
    //       this.option
    //     ).subscribe(response => {
    //       this.onAddressChanged.next(response);
    //     })
    // })
  }
  public getDistrict(idProvince): Observable<ResponseData<District[]>> {
    return this._httpClient.get<ResponseData<District[]>>(
      `${environment.apiUrl}/address/districtByProvince/${idProvince}`,
      this.option
    );
  }
  public getCommune(idDistrict): Observable<ResponseData<Commune[]>> {
    return this._httpClient.get<ResponseData<Commune[]>>(
      `${environment.apiUrl}/address/communeByDistrict/${idDistrict}`,
      this.option
    );
  }
  public getStreet(idCommune): Observable<ResponseData<Street[]>> {
    return this._httpClient.get<ResponseData<Street[]>>(
      `${environment.apiUrl}/address/streetByCommune/${idCommune}`,
      this.option
    );
  }
  public getAllStreet(): Observable<ResponseData<Street[]>> {
    return this._httpClient.get<ResponseData<Street[]>>(
      `${environment.apiUrl}/address/allStreet`,
      this.option
    );
  }
  public createStreet(body): Observable<ResponseData<Street>> {
    return this._httpClient.post<ResponseData<Street>>(
      `${environment.apiUrl}/address/street/create`,
      body,
      this.option
    );
  }
  public getProvinceName(idProvince): Observable<ResponseData<Province>> {
    return this._httpClient.get<ResponseData<Province>>(
      `${environment.apiUrl}/address/province/${idProvince}`,
      this.option
    );
  }
  public getDistrictName(idDistrict): Observable<ResponseData<District>> {
    return this._httpClient.get<ResponseData<District>>(
      `${environment.apiUrl}/address/district/${idDistrict}`,
      this.option
    );
  }

  public getProviceById(id):Observable<ResponseData<Province>>{
    return this._httpClient.get<ResponseData<Province>>(
      `${environment.apiUrl}/address/province/${id}`,
      this.option
    );
  }
  checkAlias(alias):Observable<any> {
    return this._httpClient.get(`${environment.apiUrl}/keypair/check?alias=${alias}`, this.option);
  }
}
