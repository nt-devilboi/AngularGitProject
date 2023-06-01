import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit} from '@angular/core';
import {UserStorageService} from "../../shared/services/user-storage.service";
import {IGitApi, userStore} from "../../app.module";
import {GitLabService} from "../../shared/services/git-lab.service";
import {Router} from "@angular/router";
import {AllInfoUser} from "../../shared/interfaces/AllInfoUser";
import {transition, trigger, useAnimation} from "@angular/animations";
import {opacity} from "../../shared/animations/opacity";
import {DestroyService} from "../../shared/services/destroy.service";
import {take} from "rxjs";

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

  constructor(
    @Inject(userStore) private _userStorage: UserStorageService,
    @Inject(IGitApi) private _userData: GitLabService,
    private _router: Router,
    private _destroy: DestroyService,
    private _cd: ChangeDetectorRef
  ) { }

  public ngOnInit(): void {
    let id = this._router.url.split('/').at(-1) ?? ''

    // this._userData.getAllInfoUser(id)
    //   .pipe(
    //     take(1)
    //   )
    //   .subscribe(user => {
    //     this.user = user
    //     this.toCompare = !!this._userStorage.toCompareUsers.find(e => e.id === this.user.id)
    //     this._cd.markForCheck()
    //   })

    setTimeout(() => {
      this.user = {
        id: 4380634,
        username: 'amateur-dev',
        name: 'Amateur Dev',
        avatar_url: 'https://gitlab.com/uploads/-/system/user/avatar/4380634/avatar.png',
        web_url: 'https://gitlab.com/amateur-dev',
        actions: {
          approved: 93,
          commit: 109
        },
        activeTime: 10,
        activeDay: 3,
        statsLines: {
          additions: 368277,
          deletions: 209050,
          total: 368277 + 209050,
        },
        languages: [
          'JavaScript',
          "HTML",
          'Csharp',
          'CSS'
        ]
      }

      this.toCompare = !!this._userStorage.toCompareUsers.find(e => e.id === this.user.id)
      this._cd.markForCheck()
    }, 0)
  }

  protected toggleCompare() {
    this._userStorage.toggleCompare(this.user)
    this.toCompare = !this.toCompare
    this._cd.markForCheck()
  }

}
