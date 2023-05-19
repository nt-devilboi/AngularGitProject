import {Injectable} from '@angular/core';
import {HttpRequestService} from "./http-request.service";
import {
  catchError,
  forkJoin,
  from,
  map,
  mergeMap,
  Observable,
  of,
  tap,
  zip
} from "rxjs";
import {Project} from "../interfaces/Projects/Project";
import {Language, Languages, LanguagesStats} from "../interfaces/Projects/Language";
import {HttpParams, HttpResponse} from "@angular/common/http";
import {ProjectsStats} from "../interfaces/Projects/ProjectsStats";
import {CommitResponse} from "../interfaces/Projects/CommitResponse";
import {StatsLines} from "../interfaces/Projects/StatsLines";
import {ProjectInfoNotParsed} from "../interfaces/Projects/ProjectInfoNotParsed";
import {ProjectInfoParsed} from "../interfaces/Projects/ProjectInfoParsed";
import {AllInfoUser} from "../interfaces/AllInfoUser";
import {MainInfoUser} from "../interfaces/MainInfoUser";


type dict = { [key in string]: number; };

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  constructor(
    private _http: HttpRequestService
  ) {
    console.log("Запуск")
    this.getProjectsInfo('4380634') // 4380634 2786064 4472283 - айдишники рабочие, второй не очень рабочий, но это можно отлавливать
      .subscribe({
        error: (e) => console.log(e),
        next: (e) => console.log(e)
      })

    // this.getStatisticLanguage(927908).subscribe()
  }

  public getAllInfoUser(user: MainInfoUser): Observable<AllInfoUser> {
    if (user.actions.commit === 0)
      return of<AllInfoUser>({
        ...user,
        activeDay: -1,
        activeTime: -1,
        languages: [],
        statsLines: {
          additions: 0,
          deletions: 0,
          total: 0
        }
      })

    return this.getProjectsInfo(user.id)
      .pipe(
        map(projectsInfo => ({
          ...user,
          ...projectsInfo
        }))
      )
  }

  private getProjectsInfo(userId: string) : Observable<ProjectsStats> {
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
            projectsInfoFirstPage.push(this.getProjectInfo(project.id))

          let projectsInfo: Observable<ProjectInfoNotParsed[]>[] = [
            zip(projectsInfoFirstPage)
          ]

          for (let i = 1; i < pagesCount; i++)
            projectsInfo.push(this.getProjectsInfoPerPage(userId, i))

          return zip(projectsInfo)
            .pipe(
              map(a => Array<ProjectInfoNotParsed>().concat(...a))
            )
        }),
        map(projectsInfo =>  this.parseProjects(projectsInfo))
      )
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
  }

  private getProjectLanguages(projectId: number): Observable<Partial<LanguagesStats>> {
    return this._http.getResponse<Partial<LanguagesStats>>(`projects/${projectId}/languages`)
      .pipe(
        map(r => r.body as Partial<LanguagesStats>)
      )
  }

  private getProjectCommits(projectId: number): Observable<CommitResponse[]> {
    const params: HttpParams = new HttpParams()
      .set('page', 1)
      .set('per_page', 100)

    return this._http.getResponse<{ id: string }>(`projects/${projectId}/repository/commits`, params)
      .pipe(
        mergeMap(r => {
          let commitsFirstPage: { id: string }[] = (r.body ?? []) as {id: string}[]
          let pagesCount: number = parseInt(r.headers.get(`X-Total-Pages`) ?? "1");

          let commitResponses: Observable<CommitResponse>[] = []

          for (let commit of commitsFirstPage)
            commitResponses.push(this.getProjectCommit(projectId, commit.id))

          let allProjectCommits: Observable<CommitResponse[]>[] = [
            zip(...commitResponses)
          ]

          for (let i = 1; i < pagesCount; i++) {
            allProjectCommits.push(this.getProjectCommitsPerPage(projectId, i))
          }

          return zip(allProjectCommits)
            .pipe(
              map(a => Array<CommitResponse>().concat(...a))
            )
        }),
        catchError(() => [])
      )
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
            commitResponses.push(this.getProjectCommit(projectId, commit.id))

          console.log(projectId, pageNum)

          return zip(commitResponses)
        }),
        catchError(() => [])
      )
  }

  private getProjectCommit(projectId: number, commitId: string): Observable<CommitResponse> {
    return this._http.getResponse<CommitResponse>(`projects/${projectId}/repository/commits/${commitId}`)
      .pipe(
        map(r => r.body as CommitResponse)
      )
  }

  // да простит меня бог за такой кринж
  public getStatisticLanguage(userId: number): Observable<dict> {
    return this.getProjectsByUser(userId)
      .pipe(
        mergeMap((project) => {
            let array : Observable<dict>[] = [];

            for (let i = 0; i < project.length; i++) {
              console.log(project[i].id)
              array.push(this.getLanguageProject(project[i].id))
            }

            let x = zip(array)
            return x.pipe(map(projects => {
              console.log(projects)
              let result: dict = {};
              for (let project of projects) {
                let indexElement = 0;
                for (let key in project) {
                  if (!(key in result)) {
                    result[key] = 0;
                  }
                  if (indexElement == 0) {
                    ++result[key];
                  }
                  if (indexElement == 1) {
                    result[key] += 0.5;
                  }
                  if (indexElement == 2) {
                    result[key] += 0.25;
                  }

                  ++indexElement
                }
              }

              return result;
            }))
          },
        ), map(x => Object.entries(x).sort(([, x],[, y]) => y - x).slice(0,5)),
        tap(x => console.log(x, " статистика")), from)
  }

  // есть ли смысл создавать, отдельный тип под обычный дикт? и учитывая, что языко хуеву куча, есть ли смысл создавать тип ? или что-то типо этого
  private getLanguageProject(projectId: number): Observable<dict> {
    return this._http.getResponse<{ [key in string]: number; }>(`projects/${projectId}/languages`)
      .pipe(map(x => x.body as Language))
  }

  // Todo надо сделать, чтоб он ходил по всем страницам
  private getProjectsByUser(userId: number): Observable<Project[]> {
    let uri = `users/${userId}/projects`;
    const perPage = 100;
    const params: HttpParams = new HttpParams()
      .set("page", 1)
      .set("per_page", perPage);

    return this._http.getResponse<Project[]>(uri, params)
      .pipe(mergeMap(firstResp => {
        const pagesCount: number = parseInt(firstResp.headers.get(`X-Total-Pages`) ?? "1");
        let projectFirstPage : Observable<Project[]> = of(firstResp.body ?? []);

        let pagesProjectCount: Observable<Project[]>[] = []
        pagesProjectCount.push(projectFirstPage)
        for (let page = 2; page <= pagesCount; page++) {
          console.log(page, "cтраницы")
          pagesProjectCount.push(this.getProjectPerPage(uri, page, perPage)) // убрать perPage
        }

        return zip(pagesProjectCount).pipe(map(projects => {
          let result : Project[] = [];

          for (let i = 0; i < projects.length; i++) {
            for (let j = 0; j < projects[i].length; j++) {
              result.push(projects[i][j]);
            }
          }

          return result;
        }));
      }))
  }

  private getProjectPerPage(uri: string, page: number, perPage: number): Observable<Project[]> {
    const params: HttpParams = new HttpParams()
      .set("page", page)
      .set("per_page", perPage);

    return this._http.getResponse<Project[]>(uri, params)
      .pipe(
        map(r => {
          return r.body ?? []
        })
      )
  }
}
