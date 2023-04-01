import {Injectable} from "@angular/core";
import {UserEvents} from "./user-events.service";

@Injectable({
  providedIn:  'root'
})
export class DataUsers {

  constructor(private _event: UserEvents) {
  }

  public GetApprovedUser(user: string){
    this._event.GetApprovedUser(user)
  }
}
