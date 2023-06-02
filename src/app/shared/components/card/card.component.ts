import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Inject,
  Input,
  OnInit,
  Output
} from '@angular/core';
import {UserCardComponent} from "../../interfaces/Staff/UserCardComponent";
import {DestroyService} from "../../services/destroy.service";
import {NgClass, NgIf} from "@angular/common";
import {IGitApi, userStore} from "../../../app.module";
import {GitLabService} from "../../services/git-lab.service";
import {MainInfoUser} from "../../interfaces/MainInfoUser";
import {UserStorageService} from "../../services/user-storage.service";
import {RouterLink} from "@angular/router";
import {User} from "../../interfaces/User";
import {isUserNoCompare} from "../../typeGuards/isUserNoCompare";
import {isSearchById} from "../../typeGuards/isSearchById";
import {isUserMainInfo} from "../../typeGuards/isUserMainInfo";
import {PrivateProfileDirective} from "../../directives/private-profile.directive";
import {transition, trigger, useAnimation} from "@angular/animations";
import {opacity} from "../../animations/opacity";
import {ColorCountDirective} from "../../directives/color-count.directive";

@Component({
  standalone: true,
  selector: 'app-card',
  providers: [
    DestroyService,
  ],
  imports: [
    NgIf,
    RouterLink,
    NgClass,
    PrivateProfileDirective,
    ColorCountDirective
  ],
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('enter', [
      transition(':enter',
        useAnimation(opacity), {
          params: {
            oStart: 0,
            oEnd: 1,
          }
        })
    ]),
    trigger('leave', [
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
export class CardComponent implements OnInit {

  protected user!: MainInfoUser;
  protected toCompare!: boolean
  @Input('user') userType!: UserCardComponent | MainInfoUser
  @Output() deleteEvent = new EventEmitter<[string, boolean]>
  protected isErrorFinding = false;

  // private _userStorage = inject<UserStorageService>(userStore, {
  //   skipSelf: true
  // })

  constructor(
    @Inject(IGitApi) private _userData: GitLabService,
    private _destroy: DestroyService,
    private cd: ChangeDetectorRef,
    @Inject(userStore) private _userStorage: UserStorageService,
  ) {
  }

  public ngOnInit(): void {
    if (isUserMainInfo(this.userType)) {
      this.user = this.userType
      this.isCompare(this.userType)
      this.cd.markForCheck()
      return
    }
    if (isUserNoCompare(this.userType)) {
      if (isSearchById(this.userType))
        this.getUser(this.userType.id, true)
      else
        this.getUser(this.userType.name)
    }
  }

  private isCompare(user: User): void {
    this.toCompare = !!this._userStorage.toCompareUsers.find(e => e.id === user.id)
    this.cd.markForCheck()
  }

  private getUser(param: string, searchById: boolean = false): void {
    this._userData.getMainInfoUser(param, searchById)
      .pipe(this._destroy.TakeUntilDestroy)
      .subscribe({
          next: user => {
            this.user = user
            this.isCompare(user)
            this._userStorage.storeNext(user)
            this.cd.markForCheck()
          },
          error: () => {
            this.isErrorFinding = true
            this.cd.markForCheck()
            setTimeout(() => this.deleteUser([param, searchById]), 2000)
          }
        })
  }

  protected toggleCompare() {
    if (this.user.actions.commit == 0)
      return

    this._userStorage.toggleCompare(this.user)
    this.toCompare = !this.toCompare
  }

  protected deleteUser(ident?: [string, boolean]) {
    this.deleteEvent.emit(ident !== undefined ? ident : isUserMainInfo(this.userType)
      ? [this.user.id.toString(), true]
      : isSearchById(this.userType)
        ? [this.user.id.toString(), true]
        : [this.user.username, false]
    )
  }
}
