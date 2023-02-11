import {HttpClient, HttpParams} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {environment} from "../../../environments/environment";
import {throwError} from "rxjs";
import {catchError, map, tap} from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class NotificationService {
  constructor(private http: HttpClient) {}

  

  getNotification() {
    return this.http
      .get<any>(`${environment.apiUrl}notification`)
      .pipe(catchError(this.handleError));;
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