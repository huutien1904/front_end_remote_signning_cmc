import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from 'environments/environment';
import { User, Role } from 'app/auth/models';
import { ToastrService } from 'ngx-toastr';
import { isBuffer } from 'util';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  //public
  public currentUser: Observable<User>;
  public token:any
  public getUser:any
  //private
  private currentUserSubject: BehaviorSubject<User>;

  /**
   *
   * @param {HttpClient} _http
   * @param {ToastrService} _toastrService
   */
  constructor(private _http: HttpClient, private _toastrService: ToastrService) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  // getter: currentUserValue
  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  // /**
  //  *  Confirms if user is superadmin
  //  */
  // get isAdmin() {
  //   return this.currentUser && this.currentUserSubject.value.role === Role.SuperAdmin;
  // }

  // /**
  //  *  Confirms if user is admin
  //  */
  // get isClient() {
  //   return this.currentUser && this.currentUserSubject.value.role === Role.Admin;
  // }

    get isStaff() {
    return this.currentUser && this.currentUserSubject.value.isStaff == true;
  }

  /**
   * User login
   *
   * @param email
   * @param password
   * @returns user
   */
  login(email: string, password: string) {
    const bodyRequest = {
      email: email,
      password: password,
    };
    console.log("login with " + email + " and " + password);
    // var getUser:any = {};
    return this._http
      .post<any>(`${environment.apiUrl}/authenticate`, bodyRequest, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .pipe(
        map(user => {
          console.log(user)
          // login successful if there's a jwt token in the response
          if (user && user.token) {

            // store user details and jwt token in local storage to keep user logged in between page refreshes
            localStorage.setItem('currentUser', JSON.stringify(user));
            // Display welcome toast!
            if(user.isSetSubscriber){
              setTimeout(() => {
                this._toastrService.success(
                  'Đăng nhập thành công trên SSA Server. Bạn có thể sử dụng ứng dụng ngay bây giờ! 🎉',
                  '👋 Chào mừng, ' + user.firstName + '!',
                  { toastClass: 'toast ngx-toastr', closeButton: true }
                );
              }, 3000);
            }else{
              
            }
            // notify
            this.currentUserSubject.next(user);
          }
          return user;
        }))
      

  }

  /**
   * User logout
   *
   */
  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    // notify
    this.currentUserSubject.next(null);
  }
  getData(token){
    this._http
          .get<any>(`${environment.apiUrl}/user/self-user`, {
            headers: {
              "Content-Type": "application/json",
              "Authorization": "Bearer " + token,
            },
          })
          .subscribe( res =>{   
            console.log(" 1 check",res.data);
            // localStorage.setItem('currentUser', JSON.stringify(this.getUser));
            return res.data;
          })
  }
}
