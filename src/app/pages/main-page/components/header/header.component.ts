import {Component} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  protected searchById: boolean = true;
  protected searchControl: FormControl = new FormControl(''); //Todo спросить про formgroup, или оставить так
  protected switchControl: FormControl = new FormControl(false); // не факт, что нужен, хотя для статистики требований можно оставить

  constructor() {
    // пока так костыльно, потом че нибудь адекватное сделаем
    this.searchControl.setValidators(Validators.pattern(/^\d+$/))
  }

  switchSearchMethod() {
    this.searchById = !this.searchById;

    console.log(this.searchControl.value)

    // ваще хз это, норм, я что первое в голову ударило, то и написал.
    if (this.searchById)
      this.searchControl.setValidators(Validators.pattern(/^\d+$/))
    else
      this.searchControl.clearValidators()
  }

  ok() {
    console.log(1)
  }
}

export interface IReactiveSearchForm {
  Search: FormControl<string | null>,
  Switcher: FormControl<string | null>
}
