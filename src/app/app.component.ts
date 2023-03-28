import { Component } from '@angular/core';
import {GitlabService} from "./gitlab.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ProjectArtsofte';

  constructor(
    private gitlab: GitlabService
  ) {
  }

  click(){
  }
}
