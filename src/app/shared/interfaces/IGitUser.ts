import {MainInfoUser} from "../types/User/MainInfoUser";
import {AllInfoUser} from "../types/User/AllInfoUser";
import {Observable} from "rxjs";

export interface IGitUser {
  getMainInfoUser(userIdent: string, searchByName: boolean): Observable<MainInfoUser>;
  getAllInfoUser(id: string): Observable<AllInfoUser>
}
