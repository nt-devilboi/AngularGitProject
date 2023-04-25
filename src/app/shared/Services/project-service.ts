import {Injectable} from '@angular/core';
import {HttpRequestService} from "./http-request.service";

@Injectable({
  providedIn:  'root'
})
export class ProjectService {
  constructor(private _api: HttpRequestService) {
  }

  getLanguage(userId: string, projectId: string){

  }
}
