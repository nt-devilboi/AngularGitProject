import {Inject, Injectable} from "@angular/core";
import {UserEventsService} from "./user-events.service";
import {MainInfoUser} from "../interfaces/MainInfoUser";
import {UserService} from "./user.service";
import {catchError, forkJoin, map, mergeMap, Observable, of, tap, throwError} from "rxjs";
import {UserStorageService} from "./user-storage.service";
import {IGitUser} from "../interfaces/Staff/IGitUser";
import {AllInfoUser} from "../interfaces/AllInfoUser";
import {userStore} from "../../app.module";
import {CompareResult} from "../interfaces/CompareResult";
import {compare} from "../functions/compare";

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
        mergeMap(user => this._eventsService.getActions(user.username).pipe(
          map(actions => ({
            ...user,
              actions
          }))
        ))
    )
  }

  public getAllInfoUser(id: string): Observable<AllInfoUser> {
    let allInfoUser = this._userStorage.getUserAllInfo(id)

    if (allInfoUser)
      return of(allInfoUser)

    let userMainPage = this._userStorage.getUser(id, true)

    if(userMainPage)
      return this._userService.getAllInfoUser(userMainPage)
        .pipe(
          tap(user => this._userStorage.storeNext(user)),
          catchError((e) => throwError(() => e))
        )

    return this.getMainInfoUser(id, true)
      .pipe(
        mergeMap(user => {
          return this._userService.getAllInfoUser(user)
        }),
        tap(user => this._userStorage.storeNext(user)),
        catchError((e) => {
          return throwError(() => e)
        })
      )
  }

  public getCompareResult(): Observable<CompareResult> {
    let needInfoUsers =
      this._userStorage.toCompareUsers
        .filter(user => this._userStorage.usersAllInfo
          .findIndex(e => e.id == user.id) == -1
        )

    if (needInfoUsers.length == 0) {
      return of(
        this.getCompareObject(
          this._userStorage.toCompareUsers.map(user => this._userStorage.usersAllInfo.find(e => e.id == user.id) ?? {} as AllInfoUser)
        )
      )
    }


    return forkJoin(needInfoUsers.map(e => this.getAllInfoUser(e.id.toString())))
      .pipe(
        map(() => {
          let allUsers = this._userStorage.toCompareUsers
            .filter(user => this._userStorage.usersAllInfo
              .findIndex(e => e.id == user.id) !== -1
            )
            .map(user => this._userStorage.usersAllInfo.find(e => e.id == user.id) ?? {} as AllInfoUser)

          return this.getCompareObject(allUsers)
        })
      )
  }

  private getCompareObject(users: AllInfoUser[]) {
    let result: CompareResult = {
      commit: compare(users, (user: AllInfoUser, maxValue: number) => {
        if (user.actions.commit >= maxValue)
          return [true, user.actions.commit]

        return [false, 0]
      }),
      approved: compare(users, (user: AllInfoUser, maxValue: number) => {
        if (user.actions.approved >= maxValue)
          return [true, user.actions.approved]

        return [false, 0]
      }),
      langs: compare(users, (user: AllInfoUser, maxValue: number) => {
        if (user.languages.length >= maxValue)
          return [true, user.languages.length]

        return [false, 0]
      }),
      add: compare(users, (user: AllInfoUser, maxValue: number) => {
        if (user.statsLines.additions >= maxValue)
          return [true, user.statsLines.additions]

        return [false, 0]
      }),
      delete: compare(users, (user: AllInfoUser, maxValue: number) => {
        if (user.statsLines.deletions >= maxValue)
          return [true, user.statsLines.deletions]

        return [false, 0]
      }),
      total: compare(users, (user: AllInfoUser, maxValue: number) => {
        if (user.statsLines.total >= maxValue)
          return [true, user.statsLines.total]

        return [false, 0]
      }),
      username: compare(users, (user: AllInfoUser, maxValue: number) => {
        if (user.username.length > maxValue)
          return [true, user.username.length]

        return [false, 0]
      }),
      rest: []
    }

    result.rest = users.filter(e => {
      return e.id != result.commit.id
        && e.id != result.approved.id
        && e.id != result.langs.id
        && e.id != result.add.id
        && e.id != result.delete.id
        && e.id != result.total.id
        && e.id != result.username.id
    })

    return result
  }
}
