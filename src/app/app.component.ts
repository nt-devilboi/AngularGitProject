import {Component} from '@angular/core';
import {HttpRequestService} from "./http-request.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ProjectArtsofte';
  data = []

  constructor(private gitlab: HttpRequestService) {
  }

  click() {
    this.gitlab.GetData('https://gitlab.com/api/v4/users/927908/projects').subscribe();

  }
}
