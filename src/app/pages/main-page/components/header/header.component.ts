import {Component, Inject} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {IGitApi} from "../../../../app.module";
import {GitLabService} from "../../../../shared/Services/git-lab.service";
import {MainInfoUser} from "../../../../shared/interfaces/MainInfoUser";
import {transition, trigger, useAnimation} from "@angular/animations";
import {transformOpacity} from "../../../../shared/animations/transform-opacity";
import {IReactiveSearchForm} from "../../../../shared/interfaces/IReactiveSearchForm";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
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
    ])
  ]
})

// TODO дописать, чтоку которая проверит, в serch уже что-то написано
export class HeaderComponent {
  protected formSearch: FormGroup<IReactiveSearchForm>;
  protected user?: MainInfoUser; // как я понимаю, здесь будет subjectService вместо этого
  protected isEmpty: boolean = false

  constructor(
    @Inject(IGitApi) private _userData: GitLabService
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
    })

    this.formSearch.controls.search.valueChanges.subscribe(value => {
      if (value)
        this.isEmpty = false
    })
  }

  GetUser(): any {
    if (this.formSearch.controls.search.value == "") {
      this.isEmpty = true
    } else {
      return this._userData.GetMainInfoUser(this.formSearch.controls.search.value, this.formSearch.controls.switchSearch.value)
        .subscribe(user => this.user = user);
    }
  }

  switchSearch() {
    this.formSearch.controls.switchSearch.setValue(!this.formSearch.controls.switchSearch.value);
    this.SwitchValidate();
  }

  private SwitchValidate() {
    if (this.formSearch.controls.switchSearch)
      this.formSearch.controls.search.setValidators(Validators.pattern(/^\d+$/))
    else
      this.formSearch.controls.search.removeValidators(Validators.pattern(/^\d+$/))
  }
}
