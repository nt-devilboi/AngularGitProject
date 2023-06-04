import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit} from '@angular/core';
import {UserStorageService} from "../../shared/services/user-storage.service";
import {IGitApi, userStore} from "../../app.module";
import {GitLabService} from "../../shared/services/git-lab.service";
import {Router} from "@angular/router";
import {AllInfoUser} from "../../shared/types/User/AllInfoUser";
import {transition, trigger, useAnimation} from "@angular/animations";
import {opacity} from "../../shared/animations/opacity";
import {DestroyService} from "../../shared/services/destroy.service";
import {ErrorService} from "../../shared/services/error.service";

@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.scss'],
  providers: [DestroyService],
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
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserPageComponent implements OnInit{

  protected user!: AllInfoUser
  protected toCompare = false
  protected isError: boolean = false

  constructor(
    @Inject(userStore) private _userStorage: UserStorageService,
    @Inject(IGitApi) private _userData: GitLabService,
    private _router: Router,
    private _destroy: DestroyService,
    private _cd: ChangeDetectorRef,
    private _error: ErrorService
  ) { }

  public ngOnInit(): void {
    let id = this._router.url.split('/').at(-1) ?? ''

    this._userData.getAllInfoUser(id)
      .pipe(
        this._destroy.takeUntilDestroy
      )
      .subscribe({
        next: (user) => {
          this.user = user
          this.toCompare = !!this._userStorage.toCompareUsers.find(e => e.id === this.user.id)
          this._cd.markForCheck()
        },
        error: () => {
          this.isError = true
          this._error.createError('Ошибка запроса')
          this._cd.markForCheck()
        }
      })
  }

  protected toggleCompare() {
    if (this.user.actions.commit == 0)
      return

    this._userStorage.toggleCompare(this.user)
    this.toCompare = !this.toCompare
    this._cd.markForCheck()
  }

  protected readonly transition = transition;
}
