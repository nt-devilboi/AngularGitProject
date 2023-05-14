import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, Input, OnInit} from '@angular/core';
import {UserCardComponent} from "../../interfaces/Staff/UserCardComponent";
import {UserNoCompareCard, UserNoCompareId} from "../../interfaces/Staff/UserNoCompareCard";
import {DestroyService} from "../../Services/destroy.service";
import {NgIf} from "@angular/common";
import {IGitApi} from "../../../app.module";
import {GitLabService} from "../../Services/git-lab.service";
import {MainInfoUser} from "../../interfaces/MainInfoUser";

@Component({
  standalone: true,
  selector: 'app-card',
  providers: [
    DestroyService
  ],
  templateUrl: './card.component.html',
  imports: [
    NgIf
  ],
  styleUrls: ['./card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardComponent implements OnInit {

  // public userType!: UserCardComponent;
  protected user!: MainInfoUser;

  @Input('user') userType!: UserCardComponent | MainInfoUser

  constructor(
    @Inject(IGitApi) private _userData: GitLabService,
    private _destroy: DestroyService,
    private cd: ChangeDetectorRef
  ) {
  }

  ngOnInit(): void {
    if (this.isUserMainPage(this.userType)) {
      this.user = this.userType
      return
    }
    // if (this.isUserNoCompare(this.userType)) {
    //   if (this.isSearchById(this.userType))
    //     this.getUser(this.userType.id, true)
    //   else
    //     this.getUser(this.userType.name)
    // }
  }

  private getUser(param: string | number, searchById: boolean = false): void {
    this._userData.GetMainInfoUser(param, searchById)
      .pipe(this._destroy.TakeUntilDestroy)
      .subscribe(user => {
        this.user = user
        this.cd.markForCheck()
      })
  }

  private isUserNoCompare(user: UserCardComponent): user is UserNoCompareCard {
    return !user.isCompare
  }

  // @ts-ignore
  private isSearchById(user: UserNoCompareCard): user is UserNoCompareId {
    return (user as UserNoCompareId).id !== undefined
  }

  private isUserMainPage(user: UserCardComponent | MainInfoUser): user is MainInfoUser {
    return (user as UserCardComponent).isCompare === undefined
  }
}
