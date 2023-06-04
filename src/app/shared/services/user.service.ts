import {Injectable} from '@angular/core';
import {HttpRequestService} from "./http-request.service";
import {User} from "../types/User/User";
import {HttpParams} from "@angular/common/http";
import {catchError, map, Observable, of, throwError} from "rxjs";
import {MainInfoUser} from "../types/User/MainInfoUser";
import {AllInfoUser} from "../types/User/AllInfoUser";
import {UserEventsService} from "./user-events.service";
import {UserStorageService} from "./user-storage.service";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private _http: HttpRequestService,
    private _userEvents: UserEventsService,
    private _userStorage: UserStorageService,
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

  public getAllInfoUser(user: MainInfoUser): Observable<AllInfoUser> {
    if (user.actions.commit === 0)
      return of<AllInfoUser>({
        ...user,
        activeDay: -1,
        activeTime: -1,
        languages: [],
        statsLines: {
          additions: 0,
          deletions: 0,
          total: 0
        }
      })

    return this._userEvents.getProjectsInfo(user.id.toString())
      .pipe(
        map(projectsInfo => ({
          ...user,
          ...projectsInfo
        })),
        catchError(e => {
          return throwError(e)
        })
      )
  }
}
