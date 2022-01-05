import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { AuthenticationService } from 'app/auth/service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  /**
   *
   * @param {Router} _router
   * @param {AuthenticationService} _authenticationService
   */
  constructor(private _router: Router, private _authenticationService: AuthenticationService) {}

  // canActivate
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const currentUser = this._authenticationService.currentUserValue;

    if (currentUser) {
      // check if route is restricted by role
      if (route.data.roles ) {
        console.log(route.data.roles);
        
        let check= false;
        console.log(currentUser.role);
        
        currentUser.role.forEach(role=>{
          console.log(role);
          if(route.data.roles.indexOf(role) >= 0){
            console.log("role");
            check=true;
            return true;
          }
        })
        console.log(check);
        
       if(check) {
          return true;
        }else {
          console.log("???????");
          
          this._router.navigate(['/pages/miscellaneous/not-authorized']);
        }
        
        
        // role not authorised so redirect to not-authorized page
       
        return check;
      }
      console.log("check user after role"  + route.data.roles + currentUser.role);
      // authorised so return true
      return true;
    }

    // not logged in so redirect to login page with the return url
    this._router.navigate(['/pages/authentication/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }
}
