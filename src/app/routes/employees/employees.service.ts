import {HttpClient, HttpParams} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {environment} from "../../../environments/environment";
import {throwError} from "rxjs";
import {catchError, map, tap} from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class EmployeesService {
  constructor(private http: HttpClient) {}

  createEmployee(dataObj: any) {
    return this.http
      .post<any>(`${environment.apiUrl}employees`, dataObj)
      .pipe(catchError(this.handleError));;
  }

  uploadImage(dataObj: any) {
    return this.http
      .patch<any>(`${environment.apiUrl}employees/uploadImage`, dataObj)
      .pipe(catchError(this.handleError));;
  }

  updateEmployeeDescription(dataObj: any) {
    return this.http
      .patch<any>(`${environment.apiUrl}employees/updateDescription`, dataObj)
      .pipe(catchError(this.handleError));;
  }

  getEmployeeImage(id: any) {
    return this.http
      .get<any>(`${environment.apiUrl}employees/getEmployeeImage/${id}`)
      .pipe(catchError(this.handleError));;
  }

  getEmployee(id: any) {
    return this.http
      .get<any>(`${environment.apiUrl}employees/${id}`)
      .pipe(catchError(this.handleError));;
  }

  updateEmployee(dataObj: any) {
    return this.http
      .patch<any>(`${environment.apiUrl}employees`, dataObj)
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