import {Injectable} from '@angular/core';
import {HttpClient, HttpClientModule, HttpHeaders, HttpParams} from "@angular/common/http";
import {Observable, of} from "rxjs";

@Injectable({
  providedIn:  'root'
})
export class HttpRequestService {

  private _headers: HttpHeaders = new HttpHeaders();

  constructor(
    private _http: HttpClient) {
    const token: string = "glpat-zNCQ49yJYkx_Lm-yefv4";
    this._headers.append("Authorization", `Bearer ${token}`);
  }

  //TODO написать хендлер
  GetData<TGet>(uri: string, params: HttpParams): Observable<TGet> {
    return this._http.get<TGet>("https://gitlab.com/api/v4/" + uri, {
      params,
      headers: this._headers
    })
  }

  // TODO написать норм все
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      return of(result as T);
    }
  };
}

