import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';

import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class PersonalListService implements Resolve<any> {
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
        fullName: 'Nguyễn Văn An',
        
        email: 'gslixby0@abc.net.au',
        currentPlan: 'Enterprise',
        organization: 'vin',
        avatar: '',
        passPort:'035200001170',
        numberLetter:2
      },
      {
        id: 2,
        fullName: 'Trần Thị Mến',
               email: 'hredmore1@imgur.com',
        currentPlan: 'Team',
        organization: 'mec',
        avatar: 'assets/images/avatars/10.png',
        passPort:'035200001170',
        numberLetter:3
      },
      {
        id: 3,
        fullName: 'Nguyễn Viết Hoàng',
        
        email: 'msicely2@who.int',
        currentPlan: 'Enterprise',
        organization: 'liv',
        avatar: 'assets/images/avatars/1.png',
        passPort:'035200001170',
        numberLetter:4
      },
      {
        id: 4,
        fullName: 'Phạm Cao Cường',
        
        email: 'crisby3@wordpress.com',
        currentPlan: 'Team',
        organization: 'vin',
        avatar: 'assets/images/avatars/9.png',
        passPort:'035200001170',
        numberLetter:5
      },
      {
        id: 5,
        fullName: 'Nguyễn Tiến Minh',
                email: 'mhurran4@yahoo.co.jp',
        currentPlan: 'Enterprise',
        organization: 'mec',
        avatar: 'assets/images/avatars/10.png',
        passPort:'035200001170',
        numberLetter:2
      },
      {
        id: 6,
        fullName: 'Lương Minh Trang ',
               email: 'shalstead5@shinystat.com',
        currentPlan: 'Company',
        organization: 'liv',
        avatar: '',
        passPort:'035200001170',
        numberLetter:1
      },
      {
        id: 7,
        fullName: 'Vũ Thị Huệ',
                email: 'bgallemore6@boston.com',
        currentPlan: 'Company',
        organization: 'vin',
        avatar: '',
        passPort:'035200001170',
        numberLetter:3
      },
      {
        id: 8,
        fullName: 'Đỗ Hùng Dũng',
               email: 'kliger7@vinaora.com',
        currentPlan: 'Enterprise',
        organization: 'mec',
        avatar: 'assets/images/avatars/9.png',
        passPort:'035200001170',
        numberLetter:0
      },
      {
        id: 9,
        fullName: 'Phạm Văn Nam',
               email: 'fscotfurth8@dailymotion.com',
        currentPlan: 'Team',
        organization: 'liv',
        avatar: 'assets/images/avatars/2.png',
        passPort:'035200001170',
        numberLetter:2
      },
      {
        id: 10,
        fullName: 'Vũ Việt Hoàng',
               email: 'jbellany9@kickstarter.com',
        currentPlan: 'Company',
        organization: 'vin',
        avatar: 'assets/images/avatars/9.png',
        passPort:'035200001170',
        
  
      },
      {
        id: 11,
        fullName: 'Vũ Việt Hoàng',
               email: 'jbellany9@kickstarter.com',
        currentPlan: 'Company',
        organization: 'vin',
        avatar: 'assets/images/avatars/9.png',
        passPort:'035200001170',
        
  
      },
      {
        id: 12,
        fullName: 'Vũ Việt Hoàng',
               email: 'jbellany9@kickstarter.com',
        currentPlan: 'Company',
        organization: 'vin',
        avatar: 'assets/images/avatars/9.png',
        passPort:'035200001170',
        
  
      },
    ];
    return {heroes};
  }
  /**
   * Get rows
   */
  getDataTableRows(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this._httpClient.get('api/users-data').subscribe((response: any) => {
        this.rows = response;
        console.log(response);
        this.onUserListChanged.next(this.rows);
        resolve(this.rows);
      }, reject);
    });
  }
}
