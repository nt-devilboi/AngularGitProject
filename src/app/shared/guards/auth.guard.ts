import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable, tap} from 'rxjs';
import {TokenService} from "../Services/token.service";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard{

  constructor(
    private _router: Router,
    private _token: TokenService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this._token.isValidToken()
      .pipe(
        tap(v => {
          if (!v)
            this._router.navigate(['login'])
        })
      )
  }
}
