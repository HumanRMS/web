import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { catchError } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
  })

export class AccountService {
  constructor(private http: HttpClient) {}

  login(data: any) {
    return this.http.get<any>(`${environment.apiUrl}accounts/signin/${data.UserName}/${data.Password}`)
      .pipe(catchError(this.handleError));
  }

  register(data: any) {
    return this.http.post<any>(`${environment.apiUrl}accounts/signup`,data)
      .pipe(catchError(this.handleError));
  }

  private handleError(err:any) {
    let errorMessage: string;
    if (err.error instanceof ErrorEvent) {
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      errorMessage = `Backend Returned Code: ${err.status}: ${err.body.error}`;
    }
    console.error(err);
    return throwError(errorMessage);
  }
}
