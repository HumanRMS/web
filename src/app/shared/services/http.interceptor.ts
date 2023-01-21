import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest,
} from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AuthenticationService } from '../../authentication/authentication.service';

@Injectable({
    providedIn: 'root',
})
export class RequestInterceptor implements HttpInterceptor {

    constructor(
        private readonly auth: AuthenticationService,
        private readonly router: Router,
    ) {
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        request = this.addToken(request);
        return next.handle(request)
            .pipe(
                catchError(
                    (error: any, caught: Observable<HttpEvent<any>>) => {
                        if (error.status === 401 || error.status === 0) {
                            this.handleAuthError();
                            return of(error);
                        }
                        throw error;
                    }
                ),
            );
    }


    private handleAuthError() {
        this.auth.logout();
        this.router.navigate(['']);
    }

  
    private addToken(request: HttpRequest<any>): HttpRequest<any> {
		    var user = this.auth.getUser();
        const token: string = user!=null&& user!=undefined? user.Token:'';
        if (token) {
            return request.clone({
                setHeaders: {
                    Authorization: `Bearer ${token}`,
                },
            });
        }
        return request;
    }

}