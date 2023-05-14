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
  public userDelete$: Subject<User> = new Subject<User>()
  public toCompareUsers: User[] = []
  public compare$: Subject<User> = new Subject<User>()

  constructor() { }

  public getNext(user: UserNoCompareCard | MainInfoUser) {
    this.nextUser$.next(user)
  }

  public deleteUser(user: User) {
    this.usersMainPage = this.usersMainPage.filter(e => e.id !== user.id)
    this.toCompareUsers = this.toCompareUsers.filter(e => e.id !== user.id)
    this.userDelete$.next(user)
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
