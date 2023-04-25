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
      Search: new FormControl("", Validators.pattern(/^\d+$/)),
      SearchById: new FormControl({value: true, disabled: false})
    })
  }

  switchSearchMethod() {
    this.FormSearch.controls.SearchById.setValue(!this.FormSearch.controls.SearchById.value);
    this.SwitchValidate();
  }

  // ваще хз это, норм, я что первое в голову ударило, то и написал.
  private SwitchValidate() {
    if (this.FormSearch.controls.SearchById)
      this.FormSearch.controls.Search.setValidators(Validators.pattern(/^\d+$/))
    else
      this.FormSearch.controls.Search.clearValidators()
  }
}

export interface IReactiveSearchForm {
  Search: FormControl<string | null>,
  Switcher: FormControl<string | null>
}
