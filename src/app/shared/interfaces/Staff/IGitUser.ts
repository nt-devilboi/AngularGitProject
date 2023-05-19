import {User} from "../User";
import {MainInfoUser} from "../MainInfoUser";
import {AllInfoUser} from "../AllInfoUser";
import {Observable} from "rxjs";

export interface IGitUser {
  getMainInfoUser(userIdent: string, searchByName: boolean): Observable<MainInfoUser>;
  getAllInfoUser(id: string): Observable<AllInfoUser>
}
