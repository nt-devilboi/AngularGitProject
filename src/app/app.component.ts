import {Component} from '@angular/core';
import {DataUsers} from "./shared/Services/data-users.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ProjectArtsofte';
  data = []

  constructor(private gitlab: DataUsers) {
  }

  Click() {
    this.gitlab.GetData('https://gitlab.com/api/v4/users/927908/projects').subscribe();

  }
}
