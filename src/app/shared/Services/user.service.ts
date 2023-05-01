import {Injectable} from '@angular/core';
import {HttpRequestService} from "./http-request.service";
import {User} from "../interfaces/User";
import {HttpParams} from "@angular/common/http";
import {map, Observable, tap} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private _urnGetInfoUser = (userId: string) => `users?username=${userId}`;

  constructor(
    private _http: HttpRequestService,
  ) {
  }

  // здесь лютый кринж, но работает. верю, что наши руки дойдут до рефакторинга
  public getUserNt(userName: string, searchById: boolean = false): Observable<User> {
    let params: HttpParams = new HttpParams();
    let uri: string = 'users'

    if (searchById)
      return this._http.getData<User>(uri +=`/${userName}`, params)
        .pipe(tap(console.log),
          map(resp => resp.body),
        )
    // отличие в том, что в одном месте мы получаем массив, а вдругом нет
      return this._http.getData<User>(uri, params.set('username', userName))
        .pipe(tap(console.log),
          map(resp => resp.body[0] as User),
        )
  }

  public getUser(userName: string, searchById: boolean = false): Observable<User> {
    let params: HttpParams = new HttpParams();
    let uri: string = 'users'

    if (searchById)
      uri += `/${userName}`
    else
      params = params.set('username', userName)

    // waring
    return this._http.getData<User>(uri, params)
      .pipe(tap(console.log),
        map(resp => resp.body[0] as User),
      )
  }
}
