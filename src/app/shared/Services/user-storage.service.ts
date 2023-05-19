import {Injectable} from '@angular/core';
import {Subject} from "rxjs";
import {UserNoCompareCard} from "../interfaces/Staff/UserNoCompareCard";
import {MainInfoUser} from "../interfaces/MainInfoUser";
import {User} from "../interfaces/User";

@Injectable({
  providedIn: 'root'
})
export class UserStorageService {

  public nextUser$: Subject<UserNoCompareCard | MainInfoUser> = new Subject<UserNoCompareCard | MainInfoUser>()
  public usersMainPage: MainInfoUser[] = []
  public toCompareUsers: User[] = []
  public compare$: Subject<User> = new Subject<User>()

  constructor() { }

  public getNext(user: UserNoCompareCard | MainInfoUser) {
    this.nextUser$.next(user)
  }

  public getUser(ident: string, searchById: boolean): User | undefined {
    return this.usersMainPage.find(e => searchById ? e.id == ident : e.username == ident)
  }

  public deleteUser(ident: [string, boolean]) {
    this.usersMainPage = this.usersMainPage.filter(e => ident[1] ? e.id != ident[0] : e.username != ident[0])
    this.toCompareUsers = this.toCompareUsers.filter(e => ident[1] ? e.id != ident[0] : e.username != ident[0])
  }

  public storeNext(user: MainInfoUser): void {
    this.usersMainPage.push(user)
  }

  public toggleCompare(user: User): void {
    if (this.toCompareUsers.find(e => e.id === user.id))
      this.toCompareUsers = this.toCompareUsers.filter(e => e.id !== user.id)
    else
      this.toCompareUsers.push(user)

    this.compare$.next(user)
  }
}
