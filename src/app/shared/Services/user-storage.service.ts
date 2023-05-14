import { Injectable } from '@angular/core';
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

  constructor() { }

  public getNext(user: UserNoCompareCard | MainInfoUser) {
    this.nextUser$.next(user)
  }

  public deleteUser(user: User) {
    // this.
  }

  public storeNext(user: MainInfoUser): void {
    this.usersMainPage.push(user)
  }
}
