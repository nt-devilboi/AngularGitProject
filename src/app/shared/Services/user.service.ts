import { Injectable } from '@angular/core';
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
  ) { }

  getUser(field: string, searchById: boolean = false): Observable<User> {
    let params: HttpParams = new HttpParams();
    let uri: string = 'users'

    if (searchById)
      uri += `/${field}`
    else
      params.set('username', field)

    return this._http.getData<User>(uri, params)
      .pipe(
        map(resp => resp.body as User),
      )
  }
}
