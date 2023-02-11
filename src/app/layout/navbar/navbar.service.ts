import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
  })

export class NavbarService {
  constructor(private http: HttpClient) {}

  getData() {
    return this.http.get<any>(`${environment.apiUrl}navbar`).pipe(catchError(this.handleError));
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
