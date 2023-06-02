import {Inject, Injectable} from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import {userStore} from "../../../app.module";
import {UserStorageService} from "../../../shared/services/user-storage.service";

@Injectable({
  providedIn: 'root'
})
export class CompareGuard implements CanActivate {

  constructor(
    @Inject(userStore) private _userStorage: UserStorageService
  ) {
  }

  public canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this._userStorage.toCompareUsers.length >= 2
  }
  
}
