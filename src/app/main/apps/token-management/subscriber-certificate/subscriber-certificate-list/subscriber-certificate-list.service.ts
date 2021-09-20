import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "environments/environment";
import { Observable } from "rxjs";
import * as forge from "node-forge";
import { FormGroup } from "@angular/forms";

@Injectable({
  providedIn: "root",
})
export class SubscriberCertificateListService {
  constructor(private _httpClient: HttpClient) {}

  private readonly currentUser = JSON.parse(
    localStorage.getItem("currentUser")
  );
  private readonly token = this.currentUser.token;
  readCertificate(cer): any[] {
    //decode
    let read: any = forge.pki.certificateFromPem(
      "-----BEGIN CERTIFICATE-----\r\n" +
        cer +
        "\r\n-----END CERTIFICATE-----\r\n"
    );

    //get attributes
    read = read.subject.attributes;

    //dich tieng Viet
    let res: any[] = JSON.parse(forge.util.decodeUtf8(JSON.stringify(read)));
    return res;
  }
  getData(page: number, Item: number): Observable<any[]> {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const token = currentUser.token;
    const option = {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    };
    return this._httpClient.get<any>(
      `${environment.apiUrl}/subscriber-certificate/list?page=${page}&size=${Item}`,
      option
    );
  }
  updateCert(form: FormGroup): Observable<any> {
    const formData = new FormData();
    formData.append("keypairId", form.get("keypairId").value);
    formData.append("certificate", form.get("fileSource").value);
    formData.append(
      "certificateRequestId",
      form.get("certificateRequestId").value
    );
    
    formData.append("caId", form.get("caId").value);
    console.log(formData.get("keypairId"));
    console.log(formData);
    console.log(form.value);
    const option = {
      headers: {
        Authorization: "Bearer " + this.token,
      },
    };
    return this._httpClient.post<any>(
      `${environment.apiUrl}/subscriber-certificate/update`,
      formData,
      option
    );
  }
}
