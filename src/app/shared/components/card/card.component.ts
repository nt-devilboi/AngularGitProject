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
import {DestroyService} from "../../Services/destroy.service";
import {NgClass, NgIf} from "@angular/common";
import {IGitApi} from "../../../app.module";
import {GitLabService} from "../../Services/git-lab.service";
import {MainInfoUser} from "../../interfaces/MainInfoUser";
import {UserStorageService} from "../../Services/user-storage.service";
import {RouterLink} from "@angular/router";
import {User} from "../../interfaces/User";
import {isUserNoCompare} from "../../typeGuards/isUserNoCompare";
import {isSearchById} from "../../typeGuards/isSearchById";
import {isUserMainInfo} from "../../typeGuards/isUserMainInfo";

@Component({
  standalone: true,
  selector: 'app-card',
  providers: [
    DestroyService,
    UserStorageService
  ],
  templateUrl: './card.component.html',
  imports: [
    NgIf,
    RouterLink,
    NgClass
  ],
  styleUrls: ['./card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardComponent implements OnInit {

  protected user!: MainInfoUser;
  protected toCompare!: boolean
  @Input('user') userType!: UserCardComponent | MainInfoUser
  @Output() deleteEvent = new EventEmitter<User>

  constructor(
    @Inject(IGitApi) private _userData: GitLabService,
    private _destroy: DestroyService,
    private cd: ChangeDetectorRef,
    private _userStorage: UserStorageService
  ) {
  }

  ngOnInit(): void {
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

    this._userStorage.compare$
      .pipe(this._destroy.TakeUntilDestroy)
      .subscribe(user => {
        if (user.id === this.user.id)
          this.toCompare = !this.toCompare
      })
  }

  private isCompare(user: User): void {
    this.toCompare = !!this._userStorage.toCompareUsers.find(e => e.id === user.id)
  }

  private getUser(param: string, searchById: boolean = false): void {
    this._userData.GetMainInfoUser(param, searchById)
      .pipe(this._destroy.TakeUntilDestroy)
      .subscribe(user => {
        this.user = user
        this.isCompare(user)
        this._userStorage.storeNext(user)
        this.cd.markForCheck()
      })
  }

  protected toggleCompare() {
    this._userStorage.toggleCompare(this.user)
  }

  protected deleteUser() {
    this._userStorage.deleteUser(this.user)
    this.deleteEvent.emit(this.user)
  }
}
