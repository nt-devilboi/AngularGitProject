import {Injectable} from "@angular/core";
import {HttpRequestService} from "./http-request.service";
import {
  map,
  mergeWith,
  Observable,
  of,
  range,
  startWith, Subject,
  switchMap, takeUntil, takeWhile,
  tap,
  zip
} from "rxjs";
import {Event} from "../interfaces/Event/Event";
import {HttpParams} from "@angular/common/http";


@Injectable({
  providedIn: 'root'
})
export class UserEventsService {
  private urlEvent = (userId: string) => `users/${userId}/events`;

  constructor(private _http: HttpRequestService) {
  }

  public getCountApproves(userId: string): Observable<number> {
    let params: HttpParams = new HttpParams()
      .set("action", "pushed");

    return this._http.getData<Event[]>(`${this.urlEvent(userId)}`, params)
      .pipe(
        map(resp => {
          return parseInt(resp.headers.get('x-total') ?? '')
        }),
      )
  }

  //TOdo я уверен, мы когда нибудь напишем этот метод!!!!!
  public getCommits(userId: string): Observable<number> {
    let params: HttpParams = new HttpParams()
      .set("action", "pushed")
      .set("page", 1)
      .set("per_page", 20)

    console.log("метод запущен")
    return this.getCountCommits(userId, params).pipe(map(x => x.commits));
  }

  private getCountCommits(userId: string, params: HttpParams): Observable<{ commits: number, totalPage: number }> {
    return this._http.getData<Event[]>(`${this.urlEvent(userId)}`, params)
      .pipe(map(x => {
          const total = parseInt(x.headers.get(`X-Total-Pages`) ?? "0");
          console.log("pages: " + total)
          const data = x.body ?? []
          const commits = data.map(x => x.push_data.commit_count).reduce((prev, cur) => prev + cur);
          return {commits: commits, totalPage: total}
        }), // чёта надо сделать
        tap(x => console.log(x))) // просто ради провекри
  }


  // TOdo вынести в абстракт класс, ибо это слишком универсальный метод


  // TOdo Кирил, если не нужно, надо убарть
  // getCountAction<AType>(userId: string, action: Action): Observable<ActionCount> {
  //   return this.eventsRequest<AType>(userId, action)
  //     .pipe(
  //       map(resp => ({
  //         count: resp.headers.['X-Total'],      //resp.body?.Length убрал это вместо 2, хз у меня ругается
  //         action
  //       }))
  //     )
  // }

  //TODO доделать логику с хэдерами, чтобы вычленять оттуда пагинацию и подогнать под эти типы getCountAction
  /*private eventsRequest2<TGet>(userId: string, action: string): Observable<TGet[]> {
    let params: HttpParams = new HttpParams();
    params.append("action", action);  // так не работает append возращает новый httpP а не в готовый кидает

    return zip(this._http.getData<TGet[]>(`${userId}}/events`, params)).pipe(
      map(events => events.map(e => e.body as TGet))
    )
  }
}*/
}

// надо еще будет убрать лишнее
