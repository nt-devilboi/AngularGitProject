import {
  AfterViewInit,
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component, Inject,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewContainerRef
} from '@angular/core';

import {DestroyService} from "../../../../shared/services/destroy.service";
import {UserNoCompareCard} from "../../../../shared/interfaces/Staff/UserNoCompareCard";
import {UserToTemplate} from "../../../../shared/interfaces/Staff/UserToTemplate";
import {MainInfoUser} from "../../../../shared/interfaces/MainInfoUser";
import {isUserMainInfo} from "../../../../shared/typeGuards/isUserMainInfo";
import {isSearchById} from "../../../../shared/typeGuards/isSearchById";
import {transition, trigger, useAnimation} from "@angular/animations";
import {opacity} from "../../../../shared/animations/opacity";
import {UserStorageService} from "../../../../shared/services/user-storage.service";
import {userStore} from "../../../../app.module";

@Component({
  selector: 'app-body',
  providers: [
    DestroyService
  ],
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('appear', [
      transition(':enter',
        useAnimation(opacity), {
          params: {
            oStart: 0,
            oEnd: 1,
          }
        }),
      transition(':leave',
        useAnimation(opacity), {
          params: {
            oStart: 1,
            oEnd: 0,
          }
        })
    ])
  ]
})
export class BodyComponent implements OnInit, AfterViewInit {
  @ViewChild('users', {read: ViewContainerRef}) private _usersContainer!: ViewContainerRef
  @ViewChild('user', {read: TemplateRef}) private _userTemplate!: TemplateRef<any>
  private _users: UserToTemplate[] = []

  constructor(
    @Inject(userStore) private _userStorage: UserStorageService,
    private _destroy: DestroyService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this._userStorage.nextUser$
      .pipe(this._destroy.takeUntilDestroy)
      .subscribe(user => {
        this.addView(user)
        this.cd.markForCheck()
      })
  }

  ngAfterViewInit(): void {
    for (let user of this._userStorage.usersMainPage)
      this.addView(user)

    this.cd.detectChanges()
  }

  private addView(user: MainInfoUser | UserNoCompareCard): void {
    if (isUserMainInfo(user) || isSearchById(user)) {
      this._addView(user.id.toString(), true, user)
    }
    else {
      this._addView(user.name, false, user)
    }
  }

  private _addView(ident: string, searchById: boolean, user: MainInfoUser | UserNoCompareCard): void {
    if (!!this._users.find(e => e.searchById == searchById ? e.identificator == ident : false))
      return

    let stored = this._userStorage.getUser(ident, searchById)

    if (!stored && isUserMainInfo(user))
      this._userStorage.storeNext(user)

    this._users.push({
      identificator: ident,
      searchById: searchById,
      template: this._usersContainer.createEmbeddedView(this._userTemplate, {user}, {index: 0})
    })
  }

  deleteUser(ident: [string, boolean]) {
    let i = this._users.findIndex(e => (ident[1] == e.searchById) ? ident[0] == e.identificator : false)
    if (i === -1)
      return

    this._users[i].template.destroy()
    this._users.splice(i, 1)
    this._userStorage.deleteUser(ident)
    this.cd.markForCheck()
  }
}
