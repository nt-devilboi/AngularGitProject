import {Component} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ValidatorIsIdUserNotName} from "../../ValidatorIsIdUserNotName";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  protected searchById: boolean = true;
  public SeacrhControl: FormControl = new FormControl(''); //Todo спросить про formgroup, или оставить так
  public SwitchControl: FormControl = new FormControl(false); // не факт, что нужен, хотя для статистики требований можно оставить

  constructor() {
    // пока так костыльно, потом че нибудь адекватное сделаем
    this.SeacrhControl.setValidators(Validators.pattern(/^\d+$/))
  }

  switchSearchMethod() {
    this.searchById = !this.searchById;

    console.log(this.SeacrhControl.value)

    // ваще хз это, норм, я что первое в голову ударило, то и написал.
    if (this.searchById)
      this.SeacrhControl.setValidators(Validators.pattern(/^\d+$/))
    else
      this.SeacrhControl.clearValidators()
  }
}

export interface IReactiveSearchForm {
  Search: FormControl<string | null>,
  Switcher: FormControl<string | null>
}
