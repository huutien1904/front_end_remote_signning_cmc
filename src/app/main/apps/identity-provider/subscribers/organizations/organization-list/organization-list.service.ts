import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';

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
  /**
   * Resolver
   *
   * @param {ActivatedRouteSnapshot} route
   * @param {RouterStateSnapshot} state
   * @returns {Observable<any> | Promise<any> | any}
   */
   resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return new Promise<void>((resolve, reject) => {
      Promise.all([this.getDataTableRows()]).then(() => {
        resolve();
      }, reject);
    });
  }
  createDb() {
    const heroes = [
      {
        id: 1,
        countryOrganizationId: "CMC1234", 
  
        organizationName: "SMV", 
  
        parentOrganizationId: "organization_00005", 
  
        subscriberCategoryId: "subscriberCategory_03", 
  
        leaderName: "Nguyen Huy Hoang", 
  
        province: "8", 
  
        district: "76", 
  
        commune: "255", 
  
        street: "1", 
  
        homeNumber: "hoang mai nhi", 
  
        country: "237", 
  
        phoneNumber: "0941195845", 
  
        website: "hoang1904@gmail.com", 
  
        email: "hunga1k15tv1s1w@cmc.com" ,
        avatar: 'assets/images/avatars/1.png',
      },
      {
        id: 2,
        countryOrganizationId: "CMC12347888", 
  
        organizationName: "CMC CIST", 
  
        parentOrganizationId: "organization_00005", 
  
        subscriberCategoryId: "subscriberCategory_03", 
  
        leaderName: "Le Quang Huy", 
  
        province: "8", 
  
        district: "76", 
  
        commune: "255", 
  
        street: "1", 
  
        homeNumber: "hoang mai nhi", 
  
        country: "237", 
  
        phoneNumber: "0889716224122", 
  
        website: "hunghust.sicftu.v", 
  
        email: "hunga1k15tv1s1w@cmc.com" ,
        avatar: '',
      },
      {
        id: 3,
        countryOrganizationId: "CMC123488ass", 
  
        organizationName: "CMC CIST", 
  
        parentOrganizationId: "organization_00005", 
  
        subscriberCategoryId: "subscriberCategory_03", 
  
        leaderName: "Le Quang Huy", 
  
        province: "8", 
  
        district: "76", 
  
        commune: "255", 
  
        street: "1", 
  
        homeNumber: "hoang mai nhi", 
  
        country: "237", 
  
        phoneNumber: "0889716224122", 
  
        website: "hunghust.sicftu.v", 
  
        email: "hunga1k15tv1s1w@cmc.com" ,
        avatar: 'assets/images/avatars/10.png',
      },
      {
        id: 4,
        countryOrganizationId: "CMC1234ddd", 
  
        organizationName: "CMC CIST", 
  
        parentOrganizationId: "organization_00005", 
  
        subscriberCategoryId: "subscriberCategory_03", 
  
        leaderName: "Le Quang Huy", 
  
        province: "8", 
  
        district: "76", 
  
        commune: "255", 
  
        street: "1", 
  
        homeNumber: "hoang mai nhi", 
  
        country: "237", 
  
        phoneNumber: "0889716224122", 
  
        website: "hunghust.sicftu.v", 
  
        email: "hunga1k15tv1s1w@cmc.com" ,
        avatar: 'assets/images/avatars/9.png',
      },
      {
        id: 5,
        countryOrganizationId: "CMC1234rrr", 
  
        organizationName: "CMC CIST", 
  
        parentOrganizationId: "organization_00005", 
  
        subscriberCategoryId: "subscriberCategory_03", 
  
        leaderName: "Le Quang Huy", 
  
        province: "8", 
  
        district: "76", 
  
        commune: "255", 
  
        street: "1", 
  
        homeNumber: "hoang mai nhi", 
  
        country: "237", 
  
        phoneNumber: "0889716224122", 
  
        website: "hunghust.sicftu.v", 
  
        email: "hunga1k15tv1s1w@cmc.com" ,
        avatar: 'assets/images/avatars/10.png',
      },
      {
        id: 6,
        countryOrganizationId: "CMC1234999", 
  
        organizationName: "CMC CIST", 
  
        parentOrganizationId: "organization_00005", 
  
        subscriberCategoryId: "subscriberCategory_03", 
  
        leaderName: "Le Quang Huy", 
  
        province: "8", 
  
        district: "76", 
  
        commune: "255", 
  
        street: "1", 
  
        homeNumber: "hoang mai nhi", 
  
        country: "237", 
  
        phoneNumber: "0889716224122", 
  
        website: "hunghust.sicftu.v", 
  
        email: "hunga1k15tv1s1w@cmc.com" ,
        avatar: '',
      },
      {
        id: 7,
        countryOrganizationId: "CMC1234ddd", 
  
        organizationName: "CMC CIST", 
  
        parentOrganizationId: "organization_00005", 
  
        subscriberCategoryId: "subscriberCategory_03", 
  
        leaderName: "Le Quang Huy", 
  
        province: "8", 
  
        district: "76", 
  
        commune: "255", 
  
        street: "1", 
  
        homeNumber: "hoang mai nhi", 
  
        country: "237", 
  
        phoneNumber: "0889716224122", 
  
        website: "hunghust.sicftu.v", 
  
        email: "hunga1k15tv1s1w@cmc.com" ,
        avatar: 'assets/images/avatars/9.png',
      },
    ];
    return {heroes};
  }
  /**
   * Get rows
   */
  getDataTableRows(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this._httpClient.get('api/organization-data ').subscribe((response: any) => {
        this.rows = response;
        console.log(response);
        this.onUserListChanged.next(this.rows);
        resolve(this.rows);
      }, reject);
    });
  }
}
