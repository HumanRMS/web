import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
declare var $: any;
@Injectable()
export class AuthenticationService {

  constructor(private router:Router)
  {}

  loggedIn = false;

  isLoggedInObs(): boolean {
    if (sessionStorage.getItem('___user___')) {
      var jsonString: any = sessionStorage.getItem('___user___');
      var object = JSON.parse(jsonString);
      if (
        object.Token != null &&
        object.Token != undefined &&
        object.Token != ''
      )
        return true;
      else return false;
    } else {
      return false;
    }
  }

  clearState() {
    sessionStorage.clear();
  }

  getUser(): any {
    var user = sessionStorage.getItem('___user___');
    if (user!=null && user!=undefined && user!="undefined") return JSON.parse(user);
    else return null;
  }

  getToken(): any {
    var user = sessionStorage.getItem('___user___');
    if (user!=null && user!=undefined && user!="undefined") 
    {
      var userObj = JSON.parse(user);
      return userObj.Token;
    }
    else return null;
  }

  setUser(user: any) {
    return sessionStorage.setItem('___user___', JSON.stringify(user));
  }

  logout() {
    sessionStorage.clear();
    this.router.navigate([""]);
  }
}

export const AUTH_PROVIDERS: Array<any> = [
  { provide: AuthenticationService, useClass: AuthenticationService },
];
