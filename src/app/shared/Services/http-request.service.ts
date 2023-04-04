import {Injectable} from '@angular/core';
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {Observable, of} from "rxjs";

@Injectable({
  providedIn:  'root'
})
export class HttpRequestService {

  constructor(
    private _http: HttpClient) {
  }

  //TODO написать хендлер
  GetData<TGet>(url: string): Observable<TGet> {
    return this._http.get<TGet>(url);
  }

  // TODO написать норм все
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      // this.log(`${operation} failed: ${error.message}`);


      return of(result as T);
    }
  };
}

