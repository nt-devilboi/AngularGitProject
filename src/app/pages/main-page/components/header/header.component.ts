import {Component, Inject} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {IGitApi} from "../../../../app.module";
import {GitLabService} from "../../../../shared/Services/git-lab.service";
import {MainInfoUser} from "../../../../shared/interfaces/MainInfoUser";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
// TODO дописать, чтоку которая проверит, в serch уже что-то написано
export class HeaderComponent {
  protected formSearch: FormGroup<IReactiveSearchForm>;
  protected user?: MainInfoUser; // как я понимаю, здесь будет subjectService вместо этого

  constructor(
    @Inject(IGitApi) private _userData: GitLabService
  ) {
    this.formSearch = new FormGroup<IReactiveSearchForm>({
      search: new FormControl("", {validators: Validators.pattern(/^\d+$/), nonNullable: true}),
      switchSearch: new FormControl({value: true, disabled: false}, {nonNullable: true})
    })
  }


  // TODO выкидывать, ошибку, что строка пустка, если нажать поиск
  GetUser() {
    if (this.formSearch.controls.search.value == "") {
      throw new Error("строка пусткая") // пока пусть будет так, я позже придумаю норм идею
    } else {
      return this._userData.GetMainInfoUser(this.formSearch.controls.search.value, this.formSearch.controls.switchSearch.value)
        .subscribe(user => this.user = user);
    }
  }

  switchSearch() {
    this.formSearch.controls.switchSearch.setValue(!this.formSearch.controls.switchSearch.value);
    this.SwitchValidate();
  }

  // ваще хз это, норм, я что первое в голову ударило, то и написал.
  private SwitchValidate() {
    if (this.formSearch.controls.switchSearch)
      this.formSearch.controls.search.setValidators(Validators.pattern(/^\d+$/))
    else
      this.formSearch.controls.search.removeValidators(Validators.pattern(/^\d+$/))
  }
}

// TODO А так можно оставлять или лучше вынести
export interface IReactiveSearchForm {
  search: FormControl<string>,
  switchSearch: FormControl<boolean>
}
