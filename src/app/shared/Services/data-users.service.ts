import {Injectable} from "@angular/core";
import {UserEventsService} from "./user-events.service";
import {MainInfoUser} from "../interfaces/MainInfoUser";
import {User} from "../interfaces/User";
import {UserService} from "./user.service";
import {map, mergeMap, Observable, zip} from "rxjs";
import {Actions} from "../interfaces/Actions";

@Injectable({
  providedIn:  'root'
})
export class DataUsersService {

  constructor(
    private _eventsService: UserEventsService,
    private _userService: UserService
    ) {
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
}
