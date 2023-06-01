import {Injectable} from '@angular/core';
import {HttpRequestService} from "./http-request.service";
import {User} from "../interfaces/User";
import {HttpParams} from "@angular/common/http";
import {map, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private _http: HttpRequestService,
  ) {
  }

  public getUser(userName: string | number, searchById: boolean = false): Observable<User> {
    let params: HttpParams = new HttpParams();
    let uri: string = 'users'

    if (searchById)
      uri += `/${userName}`
    else
      params = params.set('username', userName)

    return this._http.getResponse<User | User[]>(uri, params)
      .pipe(
        map(resp =>
          searchById
            ? resp.body as User
            : (resp.body as User[])[0]
        ),
      )
  }
}
