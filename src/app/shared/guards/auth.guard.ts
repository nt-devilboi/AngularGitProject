import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable, tap} from 'rxjs';
import {TokenService} from "../services/token.service";
import {ErrorService} from "../services/error.service";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard{

  constructor(
    private _router: Router,
    private _token: TokenService,
    private _error: ErrorService
  ) {}

  public canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this._token.isValidToken()
      .pipe(
        tap(v => {
          if (!v) {
            this._router.navigate(['login'])
            this._error.createError('Невалидный токен')
          }
        })
      )
  }
}
