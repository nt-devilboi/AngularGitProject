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
import {UserCardComponent} from "../../types/User/UserCardComponent";
import {DestroyService} from "../../services/destroy.service";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {IGitApi, userStore} from "../../../app.module";
import {GitLabService} from "../../services/git-lab.service";
import {MainInfoUser} from "../../types/User/MainInfoUser";
import {UserStorageService} from "../../services/user-storage.service";
import {RouterLink} from "@angular/router";
import {User} from "../../types/User/User";
import {isUserNoCompare} from "../../typeGuards/isUserNoCompare";
import {isSearchById} from "../../typeGuards/isSearchById";
import {isUserMainInfo} from "../../typeGuards/isUserMainInfo";
import {PrivateProfileDirective} from "../../directives/private-profile.directive";
import {transition, trigger, useAnimation} from "@angular/animations";
import {opacity} from "../../animations/opacity";
import {ColorCountDirective} from "../../directives/color-count.directive";
import {AllInfoUser} from "../../types/User/AllInfoUser";
import {ErrorService} from "../../services/error.service";

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
    ColorCountDirective,
    NgForOf
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
  protected allInfoUser!: AllInfoUser
  protected toCompare!: boolean
  @Input('user') public userType!: UserCardComponent | MainInfoUser | AllInfoUser
  @Input('compare') public isCompareCard: boolean = false
  @Output() public deleteEvent = new EventEmitter<[string, boolean]>
  protected isErrorFinding = false;

  constructor(
    @Inject(IGitApi) private _userData: GitLabService,
    private _destroy: DestroyService,
    private cd: ChangeDetectorRef,
    @Inject(userStore) private _userStorage: UserStorageService,
    private _error: ErrorService
  ) {
  }

  public ngOnInit(): void {
    if (isUserMainInfo(this.userType)) {
      this.user = this.userType
      this.isCompare(this.userType)

      if (this.isCompareCard) {
        // @ts-ignore
        this.allInfoUser = (this.userType as AllInfoUser)
      }

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
      .pipe(this._destroy.takeUntilDestroy)
      .subscribe({
          next: user => {
            this.user = user
            this.isCompare(user)
            this._userStorage.storeNext(user)
            this.cd.markForCheck()
          },
          error: () => {
            this.isErrorFinding = true
            this._error.createError('Ошибка запроса')
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
