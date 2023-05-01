import {Component, Inject} from '@angular/core';
import {IGitApi} from "../../../../app.module";
import {GitLabService} from "../../../../shared/Services/git-lab.service";

@Component({
  selector: 'app-body',
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.scss']
})
export class BodyComponent {
  title = 'ProjectArtsofte';

  constructor(
    @Inject(IGitApi) private _userData: GitLabService
  ) {}

  GetUser() {

  }
}
