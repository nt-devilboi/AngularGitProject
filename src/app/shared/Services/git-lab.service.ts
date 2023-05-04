import {Injectable} from "@angular/core";
import {UserEventsService} from "./user-events.service";
import {MainInfoUser} from "../interfaces/MainInfoUser";
import {UserService} from "./user.service";
import {forkJoin, map, mergeMap, Observable, tap} from "rxjs";
import {Actions} from "../interfaces/Event/Actions";
import {ProjectService} from "./project-service";

@Injectable()
export class GitLabService {

  constructor(
    private _eventsService: UserEventsService,
    private _userService: UserService,
    private _projectService: ProjectService
  ) {
  }

  public GetMainInfoUser(userIdent: string, searchByName: boolean = false): Observable<MainInfoUser> {
    return this._userService.getUserNt(userIdent, searchByName)
      .pipe(
        mergeMap(user => this.getActions(user.username).pipe(
          map(actions => ({
            ...user,
              actions
          }))
        ))
      ,tap(user => console.log(`Данные usera получены вот id ${user.id} коммиты ${user.actions.commit} ревью ${user.actions.approved} username ${user.username}`)))
  }

  private  getActions(userIdentification: string): Observable<Actions> {
    return  forkJoin({
      commit: this._eventsService.getCommits(userIdentification),
      approved: this._eventsService.getCountApproves(userIdentification),
    })
  }
}
