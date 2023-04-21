import {Injectable} from "@angular/core";
import {UserEventsService} from "./user-events.service";
import {MainInfoUser} from "../interfaces/MainInfoUser";
import {UserService} from "./user.service";
import {forkJoin, map, mergeMap, Observable} from "rxjs";
import {Actions} from "../interfaces/Actions";

@Injectable()
export class GitLabService {

  constructor(
    private _eventsService: UserEventsService,
    private _userService: UserService
  ) {
    this.getActions('2390023').subscribe((x: Actions) => console.log(x.approved, x.commit))
  }

  public GetMainInfoUser(field: string, searchByName: boolean = false): Observable<MainInfoUser> {
    return this._userService.getUser(field, searchByName)
      .pipe(
        mergeMap(user => this.getActions(user.id).pipe(
          map(actions => ({
            ...user,
            actions
          }))
        ))
      )
  }

  private  getActions(userIdentification: string): Observable<Actions> {
    return  forkJoin({
      commit: this._eventsService.getCommits(userIdentification),
      approved: this._eventsService.getCountApproves(userIdentification),
    })
  }
}
