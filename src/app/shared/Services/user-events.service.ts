import {Injectable} from "@angular/core";
import {HttpRequestService} from "./http-request.service";
import {HttpParams, HttpResponse} from "@angular/common/http";
import {map, Observable, of,  tap, zip} from "rxjs";
import {Action, ActionCount} from "../interfaces/Actions";
import {Event} from "../interfaces/Event/Event";


@Injectable({
  providedIn: 'root'
})
export class UserEventsService {
  constructor(private _http: HttpRequestService) {
    console.log("запущен EventService")
  }

  /** писать либо id либо имя*/

  getCountApproves(userId: string): Observable<number> {
    return of(20);


   /* return this.eventsRequest<Event[]>(userId, "approved")
      .pipe(
        map(arr => arr.length)
      )*/
  }

  public getCommits(userId: string): Observable<number> {
    return this.getCountCommits(userId) // здесь будет типа for
  }

  // скоро сделаю более крассивее
  private getCountCommits(userId: string): Observable<number> {
    return this.eventsRequest<Event[]>(userId, "pushed")
      .pipe(map(x => {
          const data = x.body || []
          return data.map(x => x.push_data.commit_count).reduce((prev, cur) => prev + cur)
        }), // чёта надо сделать
        tap(x => console.log(x))) // просто ради провекри
  }

  getCountAction<AType>(userId: string, action: Action): Observable<ActionCount> {
    return this.eventsRequest<AType>(userId, action)
      .pipe(
        map(resp => ({
          count: 2 ?? 0,      //resp.body?.Length убрал это вместо 2, хз у меня ругается
          action
        }))
      )
  }

  private eventsRequest<TGet>(userId: string, action: string): Observable<HttpResponse<TGet>> {
    let params: HttpParams = new HttpParams().set("action", action);

    return this._http.getData<TGet>(`users/${userId}/events`, params).pipe()
  }

  //TODO доделать логику с хэдерами, чтобы вычленять оттуда пагинацию и подогнать под эти типы getCountAction
  private eventsRequest2<TGet>(userId: string, action: string): Observable<TGet[]> {
    let params: HttpParams = new HttpParams();
    params.append("action", action);  // так не работает append возращает новый httpP а не в готовый кидает

    return zip(this._http.getData<TGet[]>(`${userId}}/events`, params)).pipe(
      map(events => events.map(e => e.body as TGet))
    )
  }
}
