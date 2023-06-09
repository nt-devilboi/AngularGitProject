import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {IGitApi, userStore} from "../../../../app.module";
import {GitLabService} from "../../../../shared/services/git-lab.service";
import {MainInfoUser} from "../../../../shared/types/User/MainInfoUser";
import {transition, trigger, useAnimation} from "@angular/animations";
import {transformOpacity} from "../../../../shared/animations/transform-opacity";
import {IReactiveSearchForm} from "../../../../shared/interfaces/IReactiveSearchForm";
import {DestroyService} from "../../../../shared/services/destroy.service";
import {UserStorageService} from "../../../../shared/services/user-storage.service";
import {UserNoCompareCard,} from "../../../../shared/types/User/UserNoCompareCard";
import {opacity} from "../../../../shared/animations/opacity";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    DestroyService
  ],
  animations: [
    trigger('invalid', [
      transition('void => *',
        useAnimation(transformOpacity, {
          params: {
            oStart: 0,
            transformStart: 'translate(-50%, 120%)',
            oEnd: 1,
            transformEnd: 'translate(-50%, 90%)',
          }
        })
      ),
      transition('* => void',
        useAnimation(transformOpacity, {
          params: {
            oStart: 1,
            transformStart: 'translate(-50%, 90%)',
            oEnd: 0,
            transformEnd: 'translate(-50%, 120%)',
          }
        })
      )
    ]),
    trigger('appear', [
      transition(':enter',
        useAnimation(opacity), {
          params: {
            oStart: 0,
            oEnd: 1,
          }
        })
    ])
  ]
})

export class HeaderComponent {
  protected formSearch: FormGroup<IReactiveSearchForm>;
  protected user?: MainInfoUser;
  protected isEmpty: boolean = false

  constructor(
    @Inject(IGitApi) private _userGitService: GitLabService,
    private _destroy: DestroyService,
    @Inject(userStore) private _userStorage: UserStorageService,
    private cd: ChangeDetectorRef
  ) {
    this.formSearch = new FormGroup<IReactiveSearchForm>({
      search: new FormControl("", {
        validators: Validators.pattern(/^\d+$/),
        nonNullable: true
      }),
      switchSearch: new FormControl(true,
        {
          nonNullable: true
        })
    });

    this.formSearch.controls.search.valueChanges
      .pipe(this._destroy.takeUntilDestroy)
      .subscribe(value => {
      if (value)
        this.isEmpty = false
    })
  }

  protected getUser(): void {
    if (this.formSearch.controls.search.value == "") {
      this.isEmpty = true

      setTimeout(() => {
        this.isEmpty = false
        this.cd.markForCheck()
      }, 3000)
    }
    else {
      if (!this.formSearch.valid) return

      let user!: UserNoCompareCard

      if (this.formSearch.controls.switchSearch.value)
        user = {
          id: this.formSearch.controls.search.value,
          isCompare: false
        } as UserNoCompareCard
      else
        user = {
          name: this.formSearch.controls.search.value,
          isCompare: false
        } as UserNoCompareCard

      this._userStorage.getNext(user)
    }
  }

  protected switchSearch() {
    this.formSearch.controls.switchSearch.setValue(!this.formSearch.controls.switchSearch.value);
    this.switchValidate();
  }

  private switchValidate() {
    if (this.formSearch.controls.switchSearch.value)
      this.formSearch.controls.search.addValidators(Validators.pattern(/^\d+$/))
    else
      this.formSearch.controls.search.clearValidators()

    this.formSearch.controls.search.updateValueAndValidity()
  }
}
