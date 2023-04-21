import {Injectable} from "@angular/core";
import {HttpRequestService} from "./http-request.service";
import {
  map,
  Observable,
  tap,
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
      .set("per_page", 100)

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
}
