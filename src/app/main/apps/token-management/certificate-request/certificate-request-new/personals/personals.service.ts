import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PersonalsService {

  constructor(private http: HttpClient) { }

  getData(pageSize, page): any{
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const token = currentUser.token;
    const option = {
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
      },
      params: {
        "page": page-1,
        "size": pageSize
      }
    };
    return this.http.get(`${environment.apiUrl}/personal/list`, option);
  }
}
