import {Component, Inject, inject} from '@angular/core';
import {GitLabService} from "./shared/Services/git-lab.service";
import {IGitUser} from "./shared/interfaces/IGitUser";
import {IGitApi} from "./app.module";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'] // сервис, которые делает отписки.... позже!!! takeuntil nzdestroy // диз система
})
export class AppComponent {
  title = 'ProjectArtsofte';
  data = []
  constructor(@Inject(IGitApi) private _userData: GitLabService) {
  }

  click() {
    this._userData.GetMainInfoUser("tristan");
  }


}
