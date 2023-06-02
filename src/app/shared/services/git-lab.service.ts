import {Inject, Injectable} from "@angular/core";
import {UserEventsService} from "./user-events.service";
import {MainInfoUser} from "../interfaces/MainInfoUser";
import {UserService} from "./user.service";
import {forkJoin, map, mergeMap, Observable, of, tap} from "rxjs";
import {Actions} from "../interfaces/Event/Actions";
import {UserStorageService} from "./user-storage.service";
import {IGitUser} from "../interfaces/Staff/IGitUser";
import {AllInfoUser} from "../interfaces/AllInfoUser";
import {userStore} from "../../app.module";

@Injectable()
export class GitLabService implements IGitUser {

  constructor(
    private _eventsService: UserEventsService,
    private _userService: UserService,
    @Inject(userStore) private _userStorage: UserStorageService
  ) {
  }

  public getMainInfoUser(userIdent: string, searchById: boolean = false): Observable<MainInfoUser> {
    return this._userService.getUser(userIdent, searchById)
      .pipe(
        mergeMap(user => this.getActions(user.username).pipe(
          map(actions => ({
            ...user,
              actions
          }))
        ))
    )
  }

  private getActions(userIdentification: string): Observable<Actions> {
    return  forkJoin({
      commit: this._eventsService.getCommits(userIdentification),
      approved: this._eventsService.getCountApproves(userIdentification),
    })
  }

  public getAllInfoUser(id: string): Observable<AllInfoUser> {
    let allInfoUser = this._userStorage.getUserAllInfo(id)

    if (allInfoUser)
      return of(allInfoUser)

    let userMainPage = this._userStorage.getUser(id, true)

    if(userMainPage)
      return this._userService.getAllInfoUser(userMainPage)
        .pipe(tap(user => this._userStorage.storeNext(user)))

    return this.getMainInfoUser(id, true)
      .pipe(
        mergeMap(user => {
          return this._userService.getAllInfoUser(user)
        }),
        tap(user => this._userStorage.storeNext(user))
      )
  }
}
