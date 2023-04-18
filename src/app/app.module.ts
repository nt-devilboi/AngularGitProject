import {InjectionToken, NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import {HttpClientModule} from "@angular/common/http";
import {IGitUser} from "./shared/interfaces/IGitUser";
import {GitLabService} from "./shared/Services/git-lab.service";
import {AppRoutingModule} from "./app-routing.module";

export const IGitApi = new InjectionToken<IGitUser>("Api")

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
  ],
  exports: [
  ],
  providers: [
    {
      provide: IGitApi,
      useClass: GitLabService
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
