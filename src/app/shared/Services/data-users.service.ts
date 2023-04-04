import {Injectable} from "@angular/core";
import {UserEventsService} from "./user-events.service";
import {MainInfoUser} from "../interfaces/MainInfoUser";
import {User} from "../interfaces/User";
import {HttpRequestService} from "./http-request.service";

@Injectable({
  providedIn:  'root'
})
export class DataUsersService {

  constructor(
    private _event: UserEventsService,
    private _httpReqService: HttpRequestService
    ) {
  }

  GetUserId(id: string): User {
    this._httpReqService.GetData<>
  }

  public GetMainInfoUser(user: string, searchByName: boolean = false): MainInfoUser {
    this._event.GetCountApproves(user);
    this._event.GetCountCommits(user);

    return {} as MainInfoUser;
  }
}
