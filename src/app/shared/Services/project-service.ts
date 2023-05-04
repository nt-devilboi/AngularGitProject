import {Injectable} from '@angular/core';
import {HttpRequestService} from "./http-request.service";
import {map, Observable, reduce} from "rxjs";
import {Project} from "../interfaces/Projects/Project";
import {Language} from "../interfaces/Projects/Language";

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  constructor(
    private _api: HttpRequestService
  ) {
  }

  public getLanguage(userId: number) {
    this.getProjectsByUser(userId)
      .pipe(
        map((project) => this.getLanguageProject(project.id)
          .pipe(
            reduce((languageProject, langAllProjects) => {
              for (let key in languageProject) {
                if (key in langAllProjects) {

                  // уу логика: надо считать проценты
                } else {

                  // ууу нада считать проценты
                  langAllProjects[key] = languageProject[key];

                }
              }

              return langAllProjects;
            })),
        ))
  }

  // есть ли смысл создавать, отдельный тип под обычный дикт? и учитывая, что языко хуеву куча, есть ли смысл создавать тип ? или что-то типо этого
  private getLanguageProject(projectId: number): Observable<{ [key in string]: number; }> {
    return this._api.getData<{ [key in string]: number; }>(`https://gitlab.com/api/v4/projects/${projectId}/languages`)
      .pipe(map(x => x.body as Language))
  }

  private getProjectsByUser(userId: number): Observable<Project> {
    return this._api.getData<Project>(`/users/${userId}/projects`)
      .pipe(map(x => x.body as Project))
  }

  private mergeLanguage(languageProject: { [key in string]: number; }, value: { [key in string]: number; }): { [key in string]: number; } {
    for (let key in languageProject) {

    }

    return languageProject;
  }
}
