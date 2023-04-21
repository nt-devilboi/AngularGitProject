import {Injectable} from "@angular/core";
import {HttpRequestService} from "./http-request.service";
import {map, mergeMap, Observable, of, zip} from "rxjs";
import {Event, PushEvent} from "../interfaces/Event/Event";
import {HttpParams, HttpResponse} from "@angular/common/http";


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

  //TODO я уверен, мы написали этот метод!!!!!

  // public getCommits(userId: string): Observable<number> {
  //   let params: HttpParams = new HttpParams()
  //     .set("action", "pushed")
  //     .set("page", 1)
  //     .set("per_page", 100)
  //
  //   console.log("метод запущен")
  //   return this.getCountCommits(userId, params).pipe(map(x => x.commits));
  // }
  //
  // private getCountCommits(userId: string, params: HttpParams): Observable<{ commits: number, totalPage: number }> {
  //   return this._http.getData<PushEvent[]>(`${this.urlEvent(userId)}`, params)
  //     .pipe(map(x => {
  //         const total = parseInt(x.headers.get(`X-Total-Pages`) ?? "0");
  //         console.log("pages: " + total)
  //         const data = x.body ?? []
  //         const commits = data.map(x => x.push_data.commit_count).reduce((prev, cur) => prev + cur);
  //         return {commits: commits, totalPage: total}
  //       }), // чёта надо сделать
  //       tap(x => console.log(x))) // просто ради провекри
  // }

  public getCommits(userId: string): Observable<number> {
    const params: HttpParams = new HttpParams()
      .set("action", "pushed")
      .set("page", 1)
      .set("per_page", 100);

    const uri: string = `${this.urlEvent(userId)}`

    return this._http.getData<PushEvent[]>(uri, params)
      .pipe(
        mergeMap((firstResp: HttpResponse<PushEvent[]>) => {
          const pagesCount: number = parseInt(firstResp.headers.get(`X-Total-Pages`) ?? "1");
          let commitsFirstPage: number = this.getCommitsFromEvents((firstResp.body ?? []))

          let pagesCommitsCount: Observable<number>[] = []

          for (let i = 1; i < pagesCount; i++) {
            pagesCommitsCount.push(this.getCommitsPerPage(uri, i + 1))
          }

          return zip(...(pagesCommitsCount.length > 0 ? pagesCommitsCount : [of(0)]))
            .pipe(
              map(arr => arr.reduce((prev, cur) => prev + cur, commitsFirstPage))
            )
        })
      )
  }

  private getCommitsPerPage(uri: string, pageNum: number): Observable<number> {
    const params: HttpParams = new HttpParams()
      .set("action", "pushed")
      .set("page", pageNum)
      .set("per_page", 100);

    return this._http.getData<PushEvent[]>(uri, params)
      .pipe(
        map((r: HttpResponse<PushEvent[]>) => {
          const data: PushEvent[] = r.body ?? []

          return this.getCommitsFromEvents(data)
        })
      )
  }

  private getCommitsFromEvents(events: PushEvent[]): number {
    return events.reduce((prev, cur) => prev + cur.push_data.commit_count, 0)
  }
}
