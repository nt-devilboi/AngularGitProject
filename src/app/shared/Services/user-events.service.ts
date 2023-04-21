import {Injectable} from "@angular/core";
import {HttpRequestService} from "./http-request.service";
import {HttpParams, HttpResponse} from "@angular/common/http";
import {
  map,
  Observable,
  Subject,
  tap,
} from "rxjs";
import {Event} from "../interfaces/Event/Event";


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

  private eventsRequest(userId: string, action: string, page: number, per_page: number): Observable<HttpResponse<Event[]>> {
    let params: HttpParams = new HttpParams().set("action", action)
    params.set("page", page)
    params.set("per_page", per_page)

    return this._http.getData<Event[]>(`users/${userId}/events`, params)
  }
}
