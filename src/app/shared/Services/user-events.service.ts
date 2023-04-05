import {Injectable} from "@angular/core";
import {HttpRequestService} from "./http-request.service";
import {HttpParams, HttpResponse} from "@angular/common/http";
import {map, Observable, zip} from "rxjs";
import {Action, ActionCount} from "../interfaces/Actions";

@Injectable({
  providedIn: 'root'
})
export class UserEventsService {
  constructor(private _http: HttpRequestService) {
  }

  /** писать либо id либо имя*/

  // getCountApproves(userId: string, userName: string): Observable<number> {
  //   return this.eventsRequest<Event[]>(userId, "approved")
  //     .pipe(
  //       map(arr => arr.length)
  //     )
  // }

  // getCountCommits(userId: string): number {
  //   let resp = this.eventsRequest<Commit[] >(userId, "pushed")
  //   let count = 0;
  //   // логика
  //   return count;
  // }

  getCountAction<AType>(userId: string, action: Action): Observable<ActionCount> {
    return this.eventsRequest<AType>(userId, action)
      .pipe(
        map(resp => ({
          count: resp.body?.length ?? 0,
          action
        }))
      )
  }

  private eventsRequest<TGet>(userId: string, action: string): Observable<HttpResponse<TGet[]>> {
    let params: HttpParams = new HttpParams();
    params.append("action", action);

    return this._http.getData<TGet[]>(`${userId}}/events`, params)
  }

  //TODO доделать логику с хэдерами, чтобы вычленять оттуда пагинацию и подогнать под эти типы getCountAction
  private eventsRequest2<TGet>(userId: string, action: string): Observable<TGet[]> {
    let params: HttpParams = new HttpParams();
    params.append("action", action);

    return zip(this._http.getData<TGet[]>(`${userId}}/events`, params)).pipe(
      map(events => events.map(e => e.body as TGet))
    )
  }
}
