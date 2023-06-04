import { Injectable } from '@angular/core';
import {HttpRequestService} from "./http-request.service";
import {catchError, map, Observable, of} from "rxjs";
import {HttpHeaders, HttpParams} from "@angular/common/http";
import {Router} from "@angular/router";
import {TokenResp} from "../types/TokenResp";

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private _timeOut!: NodeJS.Timeout

  constructor(
    private _http: HttpRequestService,
    private _router: Router
  ) {
  }

  public isValidToken(): Observable<boolean> {
    const headers: HttpHeaders = new HttpHeaders().set('PRIVATE-TOKEN', localStorage.getItem('token') ?? '')

    return this._http.getResponse<TokenResp>('personal_access_tokens/self', new HttpParams(), headers)
      .pipe(
        map(r => {
          const body: TokenResp = r.body as TokenResp

          this.setTimeOutExpiration(new Date(body.expires_at))
          return true
        }),
        catchError(() =>  of(false)
        ),
      )
  }

  private setTimeOutExpiration(expiresAt: Date) {
    let now = Date.now()
    let diff: number = expiresAt.getTime() - now;
    diff = diff < 0 ? 0 : diff > 2147483647 ? 2147483647 : diff
    clearTimeout(this._timeOut)

    this._timeOut = setTimeout(() => {
      localStorage.setItem('token', '')
      this._router.navigate(['login'])
      clearTimeout(this._timeOut)
    }, diff)
  }
}
