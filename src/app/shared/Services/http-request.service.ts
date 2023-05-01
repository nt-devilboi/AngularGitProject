import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams, HttpResponse} from "@angular/common/http";
import {Observable, of} from "rxjs";

@Injectable({
  providedIn:  'root'
})
export class HttpRequestService {
                                  // временная штука, ибо будем получать токен от пользователя
  private _headers: HttpHeaders = new HttpHeaders().set("Authorization",`Bearer glpat-jC6u1BmRBS-MLkrps3Va`);

  constructor(
    private _http: HttpClient
  ) {
  }

  //TODO написать хендлер по логике могут и не быть парамсы
  public getData<TGet>(uri: string, params?: HttpParams): Observable<HttpResponse<TGet>> {
    return this._http.get<TGet>("https://gitlab.com/api/v4/" + uri, {
      params,
      headers: this._headers,
      observe: 'response'
    })
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

