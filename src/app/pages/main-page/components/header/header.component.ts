import {Component} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  protected FormSearch: FormGroup<IReactiveSearchForm>;

  constructor() {
    this.FormSearch = new FormGroup<IReactiveSearchForm>({
      search: new FormControl("", Validators.pattern(/^\d+$/)),
      switchSearchMethod: new FormControl({value: true, disabled: false})
    })
  }

  switchSearchMethod() {
    this.FormSearch.controls.switchSearchMethod.setValue(!this.FormSearch.controls.switchSearchMethod.value);
    this.SwitchValidate();
  }

  // ваще хз это, норм, я что первое в голову ударило, то и написал.
  private SwitchValidate() {
    if (this.FormSearch.controls.switchSearchMethod)
      this.FormSearch.controls.search.setValidators(Validators.pattern(/^\d+$/))
    else
      this.FormSearch.controls.search.clearValidators()
  }
}

// TODO А так можно оставлять или лучше вынести
export interface IReactiveSearchForm {
  search: FormControl<string | null>,
  switchSearchMethod: FormControl<boolean | null>
}
