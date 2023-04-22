import {HttpClient, HttpParams} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {environment} from "../../../environments/environment";
import {throwError} from "rxjs";
import {catchError, map, tap} from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class LeavePlannerService {

  currentEvent:any = {};

  constructor(private http: HttpClient) {}

  createEvent(dataObj: any) {
    return this.http
      .post<any>(`${environment.apiUrl}leavePlanner`, dataObj)
      .pipe(catchError(this.handleError));;
  }

  getEvent() {
    return this.http
      .get<any>(`${environment.apiUrl}leavePlanner`)
      .pipe(catchError(this.handleError));;
  }

   getLeave(Id:string) {
    return this.http
      .get<any>(`${environment.apiUrl}leavePlanner/${Id}`)
      .pipe(catchError(this.handleError));;
  }

  updateEvent(dataObj: any) {
    return this.http
      .patch<any>(`${environment.apiUrl}leavePlanner`, dataObj)
      .pipe(catchError(this.handleError));;
  }

  deleteEvent(id: any) {
    return this.http
      .delete<any>(`${environment.apiUrl}leavePlanner/${id}`)
      .pipe(catchError(this.handleError));;
  }

  getEmployees() {
    return this.http
      .get<any>(`${environment.apiUrl}employees/getEmployees`)
      .pipe(catchError(this.handleError));;
  }


  updateRequest(dataObj: any) {
    return this.http
      .patch<any>(`${environment.apiUrl}request`, dataObj)
      .pipe(catchError(this.handleError));;
  }


  getCurrentEvent()
  {
    return this.currentEvent;
  }

  setCurrentEvent(currentEvent:any)
  {
     this.currentEvent = currentEvent;;
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