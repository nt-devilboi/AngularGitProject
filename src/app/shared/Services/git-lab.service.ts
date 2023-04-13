import {Injectable} from "@angular/core";
import {UserEventsService} from "./user-events.service";
import {MainInfoUser} from "../interfaces/MainInfoUser";
import {User} from "../interfaces/User";
import {UserService} from "./user.service";
import {forkJoin, map, mergeMap, Observable, tap, zip} from "rxjs";
import {Actions} from "../interfaces/Actions";

@Injectable()
export class GitLabService {

  constructor(
    private _eventsService: UserEventsService,
    private _userService: UserService
  ) {
    console.log("запущен Datauser")
    this.getActionsNik("2390023").subscribe(x => console.log(x))
  }

  public GetMainInfoUser(field: string, searchByName: boolean = false): Observable<MainInfoUser> {
    return this._userService.getUser(field, searchByName)
      .pipe(
        mergeMap(user => this.getActions(user).pipe(
          map(actions => ({
            ...user,
            actions
          }))
        ))
      )
  }


  private getActions(user: User): Observable<Actions> {
    return zip(
      this._eventsService.getCountAction<Event>(user.id, 'pushed'),
      this._eventsService.getCountAction<Event>(user.id, 'approved')
    ).pipe(
      map(events =>
        events.reduce((acc, cur) => {
          acc[cur.action] = cur.count
          return acc
        }, {} as Actions)
      )
    )
  }

  // эсперемент Warning
  private getActionsNik(username: string): Observable<{ commits: number, approved: number }> {
    const x = zip(
      this._eventsService.getCommits(username),
      this._eventsService.getCountApproves(username)
    );

    return forkJoin({
      commits: this._eventsService.getCommits(username),
      approved: this._eventsService.getCountApproves(username)
    })
  }
}
