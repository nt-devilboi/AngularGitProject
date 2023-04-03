import {Injectable} from "@angular/core";
import {UserEventsService} from "./user-events.service";

@Injectable({
  providedIn:  'root'
})
export class DataUsersService {

  constructor(private _event: UserEventsService) {
  }

  public GetMainInfoUser(user: string){
    this._event.GetCountApproves(user);
    this._event.GetCountCommits(user);
  }
}
