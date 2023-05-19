import {Injectable} from "@angular/core";
import {UserEventsService} from "./user-events.service";
import {MainInfoUser} from "../interfaces/MainInfoUser";
import {UserService} from "./user.service";
import {forkJoin, map, mergeMap, Observable} from "rxjs";
import {Actions} from "../interfaces/Event/Actions";
import {ProjectService} from "./project-service";
import {UserStorageService} from "./user-storage.service";
import {IGitUser} from "../interfaces/Staff/IGitUser";
import {AllInfoUser} from "../interfaces/AllInfoUser";

@Injectable()
export class GitLabService implements IGitUser {

  constructor(
    private _eventsService: UserEventsService,
    private _userService: UserService,
    private _projectService: ProjectService,
    private _userStorage: UserStorageService
  ) {
  }

  public getMainInfoUser(userIdent: string, searchByName: boolean = false): Observable<MainInfoUser> {
    return this._userService.getUser(userIdent, searchByName)
      .pipe(
        mergeMap(user => this.getActions(user.username).pipe(
          map(actions => ({
            ...user,
              actions
          }))
        ))
      // ,tap(user => console.log(`Данные usera получены вот id ${user.id} коммиты ${user.actions.commit} ревью ${user.actions.approved} username ${user.username}`))
    )
  }

  private  getActions(userIdentification: string): Observable<Actions> {
    return  forkJoin({
      commit: this._eventsService.getCommits(userIdentification),
      approved: this._eventsService.getCountApproves(userIdentification),
    })
  }

  public getAllInfoUser(id: string): Observable<AllInfoUser> {
    let index = this._userStorage.usersMainPage.findIndex(user => user.id == id)

    if(index !== -1)
      return this._projectService.getAllInfoUser(this._userStorage.usersMainPage[index])

    return this.getMainInfoUser(id)
      .pipe(
        mergeMap(user => {
          return this._projectService.getAllInfoUser(user)
        })
      )
  }
}
