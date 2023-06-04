import {Injectable} from "@angular/core";
import {HttpRequestService} from "./http-request.service";
import {
  catchError,
  forkJoin,
  map,
  mergeMap,
  Observable,
  of,
  throwError,
  zip
} from "rxjs";
import {Event, PushEvent} from "../interfaces/Event/Event";
import {HttpParams, HttpResponse} from "@angular/common/http";
import {ProjectsStats} from "../interfaces/Projects/ProjectsStats";
import {Project} from "../interfaces/Projects/Project";
import {ProjectInfoNotParsed} from "../interfaces/Projects/ProjectInfoNotParsed";
import {Languages, LanguagesStats} from "../interfaces/Projects/Language";
import {StatsLines} from "../interfaces/Projects/StatsLines";
import {ProjectInfoParsed} from "../interfaces/Projects/ProjectInfoParsed";
import {CommitResponse} from "../interfaces/Projects/CommitResponse";
import {Actions} from "../interfaces/Event/Actions";


@Injectable({
  providedIn: 'root'
})
export class UserEventsService {

  constructor(private _http: HttpRequestService) {
  }

  public getActions(userIdentification: string): Observable<Actions> {
    return  forkJoin({
      commit: this.getCommits(userIdentification),
      approved: this.getCountApproves(userIdentification),
    })
  }

  public getProjectsInfo(userId: string) : Observable<ProjectsStats> {
    const params: HttpParams = new HttpParams()
      .set('page', 1)
      .set('per_page', 100)

    return this._http.getResponse<Project[]>(`users/${userId}/projects`, params)
      .pipe(
        mergeMap((firstResp: HttpResponse<Project[]>) => {
          let projectsFirstPage = firstResp.body as Project[]
          const pagesCount: number = parseInt(firstResp.headers.get(`X-Total-Pages`) ?? "1");

          let projectsInfoFirstPage: Observable<ProjectInfoNotParsed>[] = []

          for (let project of projectsFirstPage)
            projectsInfoFirstPage.push(this.getProjectInfo(project.id)
              .pipe(catchError(e => throwError(() => e)))
            )

          let projectsInfo: Observable<ProjectInfoNotParsed[]>[] = [
            zip(projectsInfoFirstPage)
              .pipe(catchError(e => throwError(() => e)))
          ]

          for (let i = 1; i < pagesCount; i++)
            projectsInfo.push(this.getProjectsInfoPerPage(userId, i))

          return zip(projectsInfo)
            .pipe(
              map(a => Array<ProjectInfoNotParsed>().concat(...a))
            )
        }),
        map(projectsInfo =>  this.parseProjects(projectsInfo)),
        catchError(e => throwError(() => e))
      )
  }

  private getCountApproves(userId: string): Observable<number> {
    let params: HttpParams = new HttpParams()
      .set("action", "approved");

    return this._http.getResponse<Event[]>(`users/${userId}/events`, params)
      .pipe(
        map(resp => {
          return parseInt(resp.headers.get('x-total') ?? '')
        }),
      )
  }

  private getCommits(userId: string): Observable<number> {
    const params: HttpParams = new HttpParams()
      .set("action", "pushed")
      .set("page", 1)
      .set("per_page", 100);

    const uri: string = `users/${userId}/events`

    return this._http.getResponse<PushEvent[]>(uri, params)
      .pipe(
        mergeMap((firstResp: HttpResponse<PushEvent[]>) => {
          const pagesCount: number = parseInt(firstResp.headers.get(`X-Total-Pages`) ?? "1");
          let commitsFirstPage: number = this.getCommitsFromEvents((firstResp.body ?? []))

          let pagesCommitsCount: Observable<number>[] = []

          for (let i = 1; i < pagesCount; i++) {
            pagesCommitsCount.push(this.getCommitsPerPage(uri, i + 1)
              .pipe(catchError((e) => throwError(() => e)))
            )
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

    return this._http.getResponse<PushEvent[]>(uri, params)
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

  private parseProjects(projects: ProjectInfoNotParsed[]): ProjectsStats {
    let languages: Partial<LanguagesStats> = {}
    let days: number[] = Array.from(Array(7).keys()).map(() => 0)
    let time: number[] = Array.from(Array(23).keys()).map(() => 0)
    let stats: StatsLines = {
      additions: 0,
      deletions: 0,
      total: 0
    }
    projects
      .map(e => this.parseProject(e))
      .forEach(e => {
        stats.additions += e.stats.additions
        stats.deletions += e.stats.deletions
        stats.total += e.stats.total

        e.days.forEach((day, i) => days[i] += day)
        e.time.forEach((hour, i) => time[i] += hour)

        for (let pair of Object.entries(e.languages))
          languages[pair[0] as Languages] = (languages[pair[0] as Languages] ?? 0) + pair[1]
      })

    let maxTime = 0;
    let maxInd = 0;

    time.forEach((e, i) => {
      if (e > maxTime) {
        maxTime = e
        maxInd = i
      }
    })

    return {
      statsLines: stats,
      activeDay: days.indexOf(Math.max(...days)),
      activeTime: maxInd,
      languages: Object.entries(languages)
        .sort((a, b) => b[1] - a[1])
        .map(e => e[0]) as Languages[]
    }
  }

  private parseProject(projectInfo: ProjectInfoNotParsed): ProjectInfoParsed {
    let languages: Partial<LanguagesStats> = {}
    let i = 1

    for (let pair of Object.entries(projectInfo.languages).sort((a, b) => b[1] - a[1])) {
      languages[pair[0] as Languages] = (languages[pair[0] as Languages] ?? 0) + (pair[1] > 0 ? i : 0)
      i -= 0.25
    }

    let days: number[] = Array.from(Array(7).keys()).map(() => 0)
    let time: number[] = Array.from(Array(23).keys()).map(() => 0)
    let stats: StatsLines = {
      additions: 0,
      deletions: 0,
      total: 0
    }

    projectInfo.commits.forEach(commit => {
      stats.additions += commit.stats.additions
      stats.deletions += commit.stats.deletions
      stats.total += commit.stats.total

      let date = new Date(Date.parse(commit.created_at))
      days[date.getDay()] += 1
      time[date.getHours()] += 1
    })

    return {
      days,
      time,
      stats,
      languages
    } as ProjectInfoParsed
  }

  private getProjectsInfoPerPage(userId: string, pageNum: number): Observable<ProjectInfoNotParsed[]> {
    const params: HttpParams = new HttpParams()
      .set('page', pageNum)
      .set('per_page', 100)

    return this._http.getResponse<Project[]>(`users/${userId}/projects`, params)
      .pipe(
        mergeMap(r => {
          let projects = r.body as Project[]
          let projectsInfo: Observable<ProjectInfoNotParsed>[] = []

          for (let project of projects)
            projectsInfo.push(this.getProjectInfo(project.id))

          return zip(projectsInfo)
        }),
      )
  }

  private getProjectInfo(projectId: number): Observable<ProjectInfoNotParsed> {
    return forkJoin({
      languages: this.getProjectLanguages(projectId),
      commits: this.getProjectCommits(projectId)
    })
      .pipe(catchError(e => throwError(() => e)))
  }

  private getProjectLanguages(projectId: number): Observable<Partial<LanguagesStats>> {
    return this._http.getResponse<Partial<LanguagesStats>>(`projects/${projectId}/languages`)
      .pipe(
        map(r => r.body as Partial<LanguagesStats>),
        catchError((e) => throwError(() => e))
      )
  }

  private getProjectCommits(projectId: number): Observable<CommitResponse[]> {
    const params: HttpParams = new HttpParams()
      .set('page', 1)
      .set('per_page', 100)

    return this.checkRepository(projectId)
      .pipe(
        mergeMap(() => {
            return this._http.getResponse<{ id: string }>(`projects/${projectId}/repository/commits`, params)
              .pipe(
                mergeMap(r => {
                  let commitsFirstPage: { id: string }[] = (r.body ?? []) as { id: string }[]
                  let pagesCount: number = parseInt(r.headers.get(`X-Total-Pages`) ?? "1");

                  let commitResponses: Observable<CommitResponse>[] = []

                  for (let commit of commitsFirstPage)
                    commitResponses.push(this.getProjectCommit(projectId, commit.id)
                      .pipe(catchError(e => throwError(() => e)))
                    )

                  let allProjectCommits: Observable<CommitResponse[]>[] = [
                    zip(...commitResponses)
                      .pipe(catchError(e => throwError(() => e)))
                  ]

                  for (let i = 1; i < pagesCount; i++) {
                    allProjectCommits.push(this.getProjectCommitsPerPage(projectId, i)
                      .pipe(catchError(e => throwError(() => e)))
                    )
                  }

                  return zip(allProjectCommits)
                    .pipe(
                      map(a => Array<CommitResponse>().concat(...a))
                    )
                })
              )
          }
        ),
        catchError(() => {
          return of([])
        })
      )

  }

  private checkRepository(projectId: number): Observable<any> {
    return this._http.getResponse<any>(`projects/${projectId}/repository/branches`)
  }

  private getProjectCommitsPerPage(projectId: number, pageNum: number): Observable<CommitResponse[]> {
    const params: HttpParams = new HttpParams()
      .set('page', pageNum)
      .set('per_page', 100)

    return this._http.getResponse<{ id: string }[]>(`projects/${projectId}/repository/commits`, params)
      .pipe(
        mergeMap(r => {
          let commits: { id: string }[] = r.body as {id: string}[]
          let commitResponses: Observable<CommitResponse>[] = []

          for (let commit of commits)
            commitResponses.push(this.getProjectCommit(projectId, commit.id)
              .pipe(catchError(e => throwError(() => e)))
            )

          return zip(commitResponses)

        }),
        catchError((e) => throwError(() => e)),
      )
  }

  private getProjectCommit(projectId: number, commitId: string): Observable<CommitResponse> {
    return this._http.getResponse<CommitResponse>(`projects/${projectId}/repository/commits/${commitId}`)
      .pipe(
        map(r => {
          return r.body as CommitResponse
        }),
        catchError(e => throwError(() => e))
      )
  }
}
