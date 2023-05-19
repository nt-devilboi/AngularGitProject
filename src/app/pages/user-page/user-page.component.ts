import { Component } from '@angular/core';
import {UserStorageService} from "../../shared/Services/user-storage.service";

@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.scss']
})
export class UserPageComponent {

  constructor(
    private _userStorage: UserStorageService
  ) {
    console.log(_userStorage.usersMainPage)
  }

}
