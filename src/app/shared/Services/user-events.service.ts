import {Injectable} from "@angular/core";
import {HttpRequestService} from "./http-request.service";
import {Commit} from "../interfaces/Commit";
import {ApprovedEvent} from "../interfaces/Events/Approved";
import {MainInfoUser} from "../interfaces/MainInfoUser";
import {HttpParams} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class UserEventsService {
  constructor(private _api: HttpRequestService) {
  }

  // может написат обший метод GetData
  /** писать либо id либо имя*/

  GetCountApproves(userId: string): number {
    let resp = this.EventsRequest<ApprovedEvent[]>(userId, "Approved")
    let count = 0;
    //логика

    return count
  }

  GetCountCommits(userId: string): number {
    let resp = this.EventsRequest<Commit[] >(userId, "Commits")
    let count = 0;
    // логика
    return count;
  }

  private EventsRequest<TGet>(userId: string, action: string) {
    let params: HttpParams = new HttpParams();
    params.append("action", action);
    return this._api.GetData<TGet>(`${userId}}/events`, params)
  }
}
