import {Injectable} from "@angular/core";
import {HttpRequestService} from "./http-request.service";
import {Commit} from "../interfaces/Commit";
import {ApprovedEvent} from "../interfaces/Events/Approved";

@Injectable({
  providedIn: 'root'
})
export class UserEventsService {
  constructor(private _api: HttpRequestService) {
  }

  // может написат обший метод GetData
  /** писать либо id либо имя*/
  GetCountApproves(userId: string): number {
    let resp = this.EvetsRequest<ApprovedEvent[]>(userId, "Approved")
    let count = 0;
    //логика

    return count
  }

  GetCountCommits(userId: string): number {
    let resp = this.EvetsRequest<Commit[] >(userId, "Commits")
    let count = 0;
    //логика
    return count;
  }

  private EvetsRequest<TGet>(userId: string, action: string) {
    return this._api.GetData<TGet>(`https://gitlab.com/api/v4/users/${userId}}/events?action=${action}`)
  }
}
