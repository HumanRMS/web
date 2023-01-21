import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
  })

export class NavbarService {
  constructor(private http: HttpClient) {}

  getProfile() {
    return this.http.get<any>(`${environment.apiUrl}accounts/profile`)
      .pipe(
      );
  }

  getNotification() {
    return this.http.get<any>(`${environment.apiUrl}notification`)
      .pipe(
      );
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
