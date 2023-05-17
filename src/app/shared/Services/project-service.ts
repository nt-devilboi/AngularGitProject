import {Injectable} from '@angular/core';
import {HttpRequestService} from "./http-request.service";
import {concat, from, map, merge, mergeMap, observable, Observable, of, reduce, tap, toArray, zip} from "rxjs";
import {Project} from "../interfaces/Projects/Project";
import {Language} from "../interfaces/Projects/Language";
import * as zlib from "zlib";
import {HttpParams, HttpResponse} from "@angular/common/http";
import {PushEvent} from "../interfaces/Event/Event";
import {compileFactoryFunction} from "@angular/compiler";


type dict = { [key in string]: number; };

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  constructor(
    private _http: HttpRequestService
  ) {
    console.log("Запуск")
    this.getStatisticLanguage(927908).subscribe()
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
    return this._http.getData<{ [key in string]: number; }>(`projects/${projectId}/languages`)
      .pipe(map(x => x.body as Language))
  }

  // Todo надо сделать, чтоб он ходил по всем страницам
  private getProjectsByUser(userId: number): Observable<Project[]> {
    let uri = `users/${userId}/projects`;
    const perPage = 100;
    const params: HttpParams = new HttpParams()
      .set("page", 1)
      .set("per_page", perPage);

    return this._http.getData<Project[]>(uri, params)
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

    return this._http.getData<Project[]>(uri, params)
      .pipe(
        map(r => {
          return r.body ?? []
        })
      )
  }
}
