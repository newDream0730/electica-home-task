import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError } from 'rxjs/operators';
import { TimeTableEntry } from "../model/time-table";

@Injectable({
  providedIn: 'root'
})
export class TimeTableService {

  private readonly API_BASE_URL = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  fetchTimeTable(): Observable<TimeTableEntry[]> {
    return this.http.get<TimeTableEntry[]>(`${this.API_BASE_URL}/time_table`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    return throwError(error.message || 'Server error');
  }
}
