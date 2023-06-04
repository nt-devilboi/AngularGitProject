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
import {Event, PushEvent} from "../types/Event/Event";
import {HttpParams, HttpResponse} from "@angular/common/http";
import {CommitsStats, ProjectsStats} from "../types/Projects/ProjectsStats";
import {Project} from "../types/Projects/Project";
import {ProjectInfoNotParsed} from "../types/Projects/ProjectInfoNotParsed";
import {Languages, LanguagesStats} from "../types/Projects/Language";
import {StatsLines} from "../types/Projects/StatsLines";
import {ProjectInfoParsed} from "../types/Projects/ProjectInfoParsed";
import {CommitResponse} from "../types/Projects/CommitResponse";
import {Actions} from "../types/Event/Actions";


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

          let projectsInfoFirstPage: Observable<ProjectInfoNotParsed>[] = [
            of({
              languages: {}
            })
          ]

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

          return forkJoin({
            projects: zip(projectsInfo)
              .pipe(map(projects => Array<ProjectInfoNotParsed>().concat(...projects)))
            ,
            commits: this.getCommitsResponses(userId)
          })
        }),
        map(info =>  this.parseProjects(info.projects, info.commits)),
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

  private getCommitsResponses(userId: string): Observable<CommitResponse[]> {
    const params: HttpParams = new HttpParams()
      .set("action", "pushed")
      .set("page", 1)
      .set("per_page", 100);

    const uri: string = `users/${userId}/events`

    return this._http.getResponse<PushEvent[]>(uri, params)
      .pipe(
        mergeMap(firstResp => {
          const pagesCount: number = parseInt(firstResp.headers.get(`X-Total-Pages`) ?? "1");
          const commitsFirstPage = firstResp.body ?? []

          let commitsResponsesFirstPage=
            commitsFirstPage.map(commit => this.getProjectCommit(commit.project_id, commit.push_data.commit_to ?? commit.push_data.commit_from))

          let otherPagesResponses: Observable<CommitResponse[]>[] = [
            zip(commitsResponsesFirstPage)
          ]

          for (let i = 1; i < pagesCount; i++)
            otherPagesResponses.push(this.getCommitsResponsesPerPage(userId, i))

          return  zip(otherPagesResponses)
            .pipe(map(responses => Array<CommitResponse>().concat(...responses)))
        })
      )
  }

  private getCommitsResponsesPerPage(userId: string, pageNum: number): Observable<CommitResponse[]> {
    const params: HttpParams = new HttpParams()
      .set("action", "pushed")
      .set("page", pageNum)
      .set("per_page", 100);

    const uri: string = `users/${userId}/events`

    return this._http.getResponse<PushEvent[]>(uri, params)
      .pipe(
        mergeMap(resp => {
          const commits = resp.body ?? []

          let commitsResponses =
            commits.map(commit => this.getProjectCommit(commit.project_id, commit.push_data.commit_to ?? commit.push_data.commit_from))

          return zip(commitsResponses.length > 0 ? commitsResponses : [null])
            .pipe(map(arr => {
              // @ts-ignore
              return arr.filter(e => !!e) as CommitResponse[]
            }))
        })
      )
  }

  private getCommitsFromEvents(events: PushEvent[]): number {
    return events.reduce((prev, cur) => prev + cur.push_data.commit_count, 0)
  }

  private parseProjects(projects: ProjectInfoNotParsed[], commits: CommitResponse[]): ProjectsStats {
    let languages: Partial<LanguagesStats> = {}

    projects
      .map(e => this.parseProjectLanguages(e))
      .forEach(e => {
        for (let pair of Object.entries(e.languages))
          languages[pair[0] as Languages] = (languages[pair[0] as Languages] ?? 0) + pair[1]
      })

    return {
      ...this.parseCommits(commits),
      languages: Object.entries(languages)
        .sort((a, b) => b[1] - a[1])
        .map(e => e[0]) as Languages[]
    }
  }

  private parseCommits(commits: CommitResponse[]): CommitsStats {
    let days: number[] = Array.from(Array(7).keys()).map(() => 0)
    let time: number[] = Array.from(Array(23).keys()).map(() => 0)
    let stats: StatsLines = {
      additions: 0,
      deletions: 0,
      total: 0
    }

    commits.forEach(commit => {
      stats.additions += commit.stats.additions
      stats.deletions += commit.stats.deletions
      stats.total += commit.stats.total

      let date = new Date(Date.parse(commit.created_at))
      days[date.getDay()] += 1
      time[date.getHours()] += 1
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
      activeTime: maxInd
    }
  }

  private parseProjectLanguages(projectInfo: ProjectInfoNotParsed): ProjectInfoParsed {
    let languages: Partial<LanguagesStats> = {}
    let i = 1

    for (let pair of Object.entries(projectInfo.languages).sort((a, b) => b[1] - a[1])) {
      languages[pair[0] as Languages] = (languages[pair[0] as Languages] ?? 0) + (pair[1] > 0 ? i : 0)
      i -= 0.25
    }

    return {
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
