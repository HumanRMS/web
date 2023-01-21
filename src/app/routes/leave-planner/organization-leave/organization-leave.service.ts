import {HttpClient, HttpParams} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {environment} from "../../../../environments/environment";
import {throwError} from "rxjs";
import {catchError, map, tap} from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class OrganizationLeaveService {
  constructor(private http: HttpClient) {}

  createEvent(dataObj: any) {
    return this.http
      .post<any>(`${environment.apiUrl}leavePlanner/organizationLeave`, dataObj)
      .pipe(catchError(this.handleError));;
  }

  getEvent() {
    return this.http
      .get<any>(`${environment.apiUrl}leavePlanner/organizationLeave`)
      .pipe(catchError(this.handleError));;
  }

  updateEvent(dataObj: any) {
    return this.http
      .patch<any>(`${environment.apiUrl}leavePlanner/organizationLeave`, dataObj)
      .pipe(catchError(this.handleError));;
  }

  deleteEvent(id: any) {
    return this.http
      .delete<any>(`${environment.apiUrl}leavePlanner/${id}`)
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