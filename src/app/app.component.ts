import {Component} from '@angular/core';
import {DataUsers, DataUsersService} from "./shared/Services/data-Users.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ProjectArtsofte';
  data = []
  constructor(private _userData: DataUsersService) {
  }

  Click() {
    this._userData.GetMainInfoUser(name);
  }
}
