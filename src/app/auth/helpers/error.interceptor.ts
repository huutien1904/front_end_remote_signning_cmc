import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError, timer } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AuthenticationService } from 'app/auth/service';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  /**
   * @param {Router} _router
   * @param {AuthenticationService} _authenticationService
   * @param {ToastrService} _toastr
   * @param {NgbModal} _modal
   */
  constructor(
    private _router: Router,
    private _authenticationService: AuthenticationService,
    private _toastr: ToastrService,
    private _modal: NgbModal) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log("HttpInterceptor is working");
    return next.handle(request).pipe(
      catchError(err => {
        if ([0, 401, 403, 404, 500, 503].indexOf(err.status) !== -1) {
          // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
          console.log(err);
          //Lỗi Unknown Error: Hiện toastr báo lỗi, ko đóng modal, form...
          if(err.status == 0) {
            this._toastr.error('Đã có lỗi xảy ra. Chúng tôi đang cố gắng khắc phục sự cố.', 'Lỗi', {
              positionClass: 'toast-top-center',
              toastClass: 'toast ngx-toastr',
              closeButton: true,
              timeOut: 8000
            })
          }
          else {
            //Các lỗi khác: Chuyển trang báo lỗi, đóng tất cả form, modal đang mở
            this._modal.dismissAll();
            if(err.status == 401)
              this._router.navigate(['/pages/miscellaneous/not-authorized']);
            else if(err.status == 403 || err.status == 404)
              this._router.navigate(['/pages/miscellaneous/error']);
            else if(err.status == 500 || err.status == 503)
              this._router.navigate(['/pages/miscellaneous/maintenance']);
          }

          // ? Can also logout and reload if needed
          // this._authenticationService.logout();
          // location.reload(true);
        }
        // throwError
        const error = err.error.message || err.statusText;
        return throwError(error);
      })
    );
  }
}
