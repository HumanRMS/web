import {HttpClient, HttpParams} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {environment} from "../../../environments/environment";
import {throwError} from "rxjs";
import {catchError, map, tap} from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class OrganizationService {
  constructor(private http: HttpClient) {}

  createOrganization(dataObj: any) {
    return this.http
      .post<any>(`${environment.apiUrl}organization`, dataObj)
      .pipe(catchError(this.handleError));;
  }

  uploadImage(dataObj: any) {
    return this.http
      .patch<any>(`${environment.apiUrl}organization/uploadImage`, dataObj)
      .pipe(catchError(this.handleError));;
  }

  organizationImage(id: any) {
    return this.http
      .get<any>(`${environment.apiUrl}organization/getOrganizationImage/${id}`)
      .pipe(catchError(this.handleError));;
  }

  getOrganization(id: any) {
    return this.http
      .get<any>(`${environment.apiUrl}organization/${id}`)
      .pipe(catchError(this.handleError));;
  }

  getStates() {
    return this.http
      .get<any>(`${environment.apiUrl}lovs/states`)
      .pipe(catchError(this.handleError));;
  }

  updateorganization(dataObj: any) {
    return this.http
      .patch<any>(`${environment.apiUrl}organization`, dataObj)
      .pipe(catchError(this.handleError));;
  }

  updateorganizationDescription(dataObj: any) {
    return this.http
      .patch<any>(`${environment.apiUrl}organization/updateDescription`, dataObj)
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