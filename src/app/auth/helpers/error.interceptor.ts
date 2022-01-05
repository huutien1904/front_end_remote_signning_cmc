import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
} from '@angular/common/http';
import { Observable, throwError, timer } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { AuthenticationService } from 'app/auth/service';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Injectable(
  {
    providedIn:'root'
  }
)
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
    private _modal: NgbModal
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // if (token) {
    //   request = request.clone({
    //     headers: request.headers.set('Authorization', 'Bearer ' + token),
    //   });
    // }

    // if (!request.headers.has('Content-Type')) {
    //   request = request.clone({
    //     headers: request.headers.set('Content-Type', 'application/json'),
    //   });
    // }

    // request = request.clone({
    //   headers: request.headers.set('Accept', 'application/json'),
    // });
    if (request.method === 'POST') {
      console.log('check success');
      Promise.resolve('true').then(
        (error) => (console.log(error))
      );
    }
    return next.handle(request).pipe(
      map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          if(!event.body.result && event.body.hasOwnProperty("result")){
            this._toastr.error(
              event.body.data==null?'Đã có lỗi xảy ra. Chúng tôi đang cố gắng khắc phục sự cố.':String(event.body.data),
              event.body.message,
              {
                positionClass: 'toast-top-center',
                toastClass: 'toast ngx-toastr',
                closeButton: true,
                timeOut: 6000,
              }
            );
            if (event.body.code == 401)
              this._router.navigate(['/pages/miscellaneous/not-authorized']);
          }
        }
        return event;
      }),
      catchError((err) => {
        console.log(err);
        // if ([0, 401, 400, 403, 404, 500, 503].indexOf(err.status) !== -1) {
          // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
          console.log(err);
          //Lỗi Unknown Error: Hiện toastr báo lỗi, ko đóng modal, form...
            console.log("?????");
            this._toastr.error(
              err.error.message,
              err.statusText,
              {
                positionClass: 'toast-top-center',
                toastClass: 'toast ngx-toastr',
                closeButton: true,
                timeOut: 8000,
              }
            );
          
        // }
        // if ([0, 401, 400, 403, 404, 500, 503].indexOf(err.status) !== -1) {
        //   // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
        //   console.log(err);
        //   //Lỗi Unknown Error: Hiện toastr báo lỗi, ko đóng modal, form...
        //   if (err.status == 0) {
        //     console.log("?????");
            
        //     this._toastr.error(
        //       'Đã có lỗi xảy ra. Chúng tôi đang cố gắng khắc phục sự cố.',
        //       err.statusText,
        //       {
        //         positionClass: 'toast-top-center',
        //         toastClass: 'toast ngx-toastr',
        //         closeButton: true,
        //         timeOut: 8000,
        //       }
        //     );
        //   } else {
        //     //Các lỗi khác: Chuyển trang báo lỗi, đóng tất cả form, modal đang mở
        //     this._modal.dismissAll();
        //     // if (err.status == 401)
        //       // this._router.navigate(['/pages/miscellaneous/not-authorized']);
        //     // if(err.status == 403 || err.status == 404)
        //     //   this._router.navigate(['/pages/miscellaneous/error']);
        //     // else if(err.status == 500 || err.status == 503)
        //     //   this._router.navigate(['/pages/miscellaneous/maintenance']);
        //   }

        //   // ? Can also logout and reload if needed
        //   // this._authenticationService.logout();
        //   // location.reload();
        // }
        // throwError
        const error = err.error.message || err.statusText;
        return throwError(error);
      })
    );
  }
}
