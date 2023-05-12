import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams, HttpResponse} from "@angular/common/http";
import {catchError, Observable, of, throwError} from "rxjs";

@Injectable({
  providedIn:  'root'
})
export class HttpRequestService {

  constructor(
    private _httpClient: HttpClient,
  ) {
  }

  //TODO написать хендлер по логике могут и не быть парамсы
  public getData<TGet>(
    uri: string,
    params?: HttpParams,
    headers: HttpHeaders = new HttpHeaders().append('Authorization', `Bearer ${localStorage.getItem('token')}`)
  ): Observable<HttpResponse<TGet>> {
    return this._httpClient.get<TGet>("https://gitlab.com/api/v4/" + uri, {
      params,
      headers,
      observe: 'response'
    })
      .pipe(
        catchError((err) => throwError(err))
      )
  }

  // TODO написать норм все
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<HttpResponse<T>> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      // this.log(`${operation} failed: ${error.message}`);


      return of(result as HttpResponse<T>);
    }
  };
}

