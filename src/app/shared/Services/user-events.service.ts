import {Injectable} from "@angular/core";
import {HttpRequestService} from "./http-request.service";

@Injectable({
  providedIn: 'root'
})
export class UserEvents {
  constructor(private _api: HttpRequestService) {
  }


  /** писать либо id либо имя*/
  GetApprovedUser(userId: string): void {
    this._api.GetData(`https://gitlab.com/api/v4/users/${userId}}/events?action=approved`)
  }
}
