import {Injectable} from "@angular/core";
import {HttpRequestService} from "./http-request.service";
import {HttpParams, HttpResponse} from "@angular/common/http";
import {
  AsyncSubject,
  forkJoin,
  from,
  generate,
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
import {addWarning} from "@angular-devkit/build-angular/src/utils/webpack-diagnostics";


@Injectable({
  providedIn: 'root'
})
export class UserEventsService {
  constructor(private _http: HttpRequestService) {
    console.log("запущен EventService")
  }

  getCountApproves(userId: string): Observable<number> {
    return this.eventsRequest(userId, 'approved', 1, 1)
      .pipe(
        map(resp => {
          return parseInt(resp.headers.get('x-total') ?? '')
        }),
      )
  }

  public getCommits(userId: string): Observable<number> {
    var page = 1;

    var per_page = 100;
    let total = 0;
    let result = new Subject<number>();
    console.log("метод запущен")
    this.getCountCommits(userId, page, per_page)


    return result.asObservable();
  }

  private getCountCommits(userId: string, page: number, per_page: number): Observable<{
    commits: number,
    totalPage: number
  }> {
    return this.eventsRequest(userId, "pushed", page, per_page)
      .pipe(map(x => {
          const total = parseInt(x.headers.get(`X-Total-Pages`) ?? "0");
          console.log("pages: " + total)
          const data = x.body ?? []
          const commits = data.map(x => x.push_data.commit_count).reduce((prev, cur) => prev + cur);
          return {commits: commits, totalPage: total}
        }), // чёта надо сделать
        tap(x => console.log(x))) // просто ради провекри
  }

  // getCountAction<AType>(userId: string, action: Action): Observable<ActionCount> {
  //   return this.eventsRequest<AType>(userId, action)
  //     .pipe(
  //       map(resp => ({
  //         count: resp.headers.['X-Total'],      //resp.body?.Length убрал это вместо 2, хз у меня ругается
  //         action
  //       }))
  //     )
  // }

  private eventsRequest(userId: string, action: string, page: number, per_page: number): Observable<HttpResponse<Event[]>> {
    let params: HttpParams = new HttpParams().set("action", action)
    params.set("page", page)
    params.set("per_page", per_page)

    return this._http.getData<Event[]>(`users/${userId}/events`, params)
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
