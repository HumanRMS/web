import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';
import { AuthenticationService } from './authentication.service';

declare var $: any;

@Injectable()
export class LoggedInGuard implements CanActivate
{
    constructor(private authenticationService: AuthenticationService, private router: Router)
    {

    }
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean>
    {
        const isLoggedIn = this.authenticationService.isLoggedInObs();

        if (!isLoggedIn)
        {
            this.router.navigate(['/auth']);
        }

        return isLoggedIn;
    }

}