import {FormControl} from "@angular/forms";

export interface IReactiveSearchForm {
  search: FormControl<string>,
  switchSearch: FormControl<boolean>
}
