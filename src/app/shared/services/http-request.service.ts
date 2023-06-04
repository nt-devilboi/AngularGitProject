import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams, HttpResponse} from "@angular/common/http";
import {catchError, Observable, throwError} from "rxjs";

@Injectable({
  providedIn:  'root'
})
export class HttpRequestService {

  constructor(
    private _httpClient: HttpClient,
  ) {
  }

  public getResponse<TGet>(
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
}

