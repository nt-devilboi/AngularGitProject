import {
  AfterViewInit,
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import {UserStorageService} from "../../../../shared/Services/user-storage.service";
import {DestroyService} from "../../../../shared/Services/destroy.service";
import {UserNoCompareCard} from "../../../../shared/interfaces/Staff/UserNoCompareCard";
import {UserToTemplate} from "../../../../shared/interfaces/Staff/UserToTemplate";
import {MainInfoUser} from "../../../../shared/interfaces/MainInfoUser";
import {isUserMainInfo} from "../../../../shared/typeGuards/isUserMainInfo";
import {isSearchById} from "../../../../shared/typeGuards/isSearchById";
import {User} from "../../../../shared/interfaces/User";

@Component({
  selector: 'app-body',
  providers: [
    DestroyService
  ],
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BodyComponent implements OnInit, AfterViewInit {
  @ViewChild('users', {read: ViewContainerRef}) usersContainer!: ViewContainerRef
  @ViewChild('user', {read: TemplateRef}) userTemplate!: TemplateRef<any>
  private _users: UserToTemplate[] = []

  constructor(
    private _userStorage: UserStorageService,
    private _destroy: DestroyService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this._userStorage.nextUser$
      .pipe(this._destroy.TakeUntilDestroy)
      .subscribe(user => {
        this.addView(user)
        this.cd.markForCheck()
      })

    //TODO я просто хз почему не работает хотя блин должно

    // this._userStorage.userDelete$.subscribe(e => console.log(true))
    //
    // this._userStorage.userDelete$
    //   .pipe(this._destroy.TakeUntilDestroy)
    //   .subscribe(user => {
    //     let i = this._users.findIndex(e => e.identificator === user.id || e.identificator === user.username)
    //
    //     if (i === -1)
    //       return
    //
    //     this._users[i].template.destroy()
    //     this._users.splice(i, 1)
    //     this.cd.markForCheck()
    //   })
  }

  ngAfterViewInit(): void {
    // for (let i = 0; i < 2; i++) {
    //   // @ts-ignore
    //   let user = {
    //     id: 1,
    //     isCompare: false
    //   } as UserNoCompareCard
    //
    //   this.addView(user)
    // }

    for (let user of this._userStorage.usersMainPage)
      this.addView(user)

    this.cd.detectChanges()
  }

  private addView(user: MainInfoUser | UserNoCompareCard): void {
    let view = this.usersContainer.createEmbeddedView(this.userTemplate, {user}, {index: 0})

    if (isUserMainInfo(user) || isSearchById(user))
      this._users.push({
        identificator: user.id,
        template: view
      })
    else
      this._users.push({
        identificator: user.name,
        template: view
      })
  }

  deleteUser(user: User) {
    let i = this._users.findIndex(e => e.identificator == user.id || e.identificator == user.username)
    if (i === -1)
      return

    this._users[i].template.destroy()
    this._users.splice(i, 1)
    this.cd.markForCheck()
  }
}
