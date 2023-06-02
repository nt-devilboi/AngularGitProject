import {Injectable} from '@angular/core';
import {Subject} from "rxjs";
import {UserNoCompareCard} from "../interfaces/Staff/UserNoCompareCard";
import {MainInfoUser} from "../interfaces/MainInfoUser";
import {User} from "../interfaces/User";
import {AllInfoUser} from "../interfaces/AllInfoUser";
import {isAllInfoUser} from "../typeGuards/isAllInfoUser";

@Injectable({
  providedIn: 'root'
})
export class UserStorageService {

  public nextUser$: Subject<UserNoCompareCard | MainInfoUser> = new Subject<UserNoCompareCard | MainInfoUser>()
  public usersMainPage: MainInfoUser[] = []
  public toCompareUsers: User[] = []
  public usersAllInfo: AllInfoUser[] = []

  constructor() { }

  public getNext(user: UserNoCompareCard | MainInfoUser) {
    this.nextUser$.next(user)
  }

  public getUser(ident: string, searchById: boolean): MainInfoUser | undefined {
    return this.usersMainPage.find(e => searchById ? e.id == ident : e.username == ident)
  }

  public getUserAllInfo(id: string): AllInfoUser | undefined {
    return this.usersAllInfo.find(e => e.id == id)
  }

  public deleteUser(ident: [string, boolean]) {
    this.usersMainPage = this.usersMainPage.filter(e => ident[1] ? e.id != ident[0] : e.username != ident[0])
    this.toCompareUsers = this.toCompareUsers.filter(e => ident[1] ? e.id != ident[0] : e.username != ident[0])
  }

  public storeNext(user: MainInfoUser): void {
    if (isAllInfoUser(user))
      this.usersAllInfo.push(user)

    this.usersMainPage.push(user)
  }

  public toggleCompare(user: User): void {
    if (this.toCompareUsers.find(e => e.id === user.id))
      this.toCompareUsers = this.toCompareUsers.filter(e => e.id !== user.id)
    else
      this.toCompareUsers.push(user)
  }
}
