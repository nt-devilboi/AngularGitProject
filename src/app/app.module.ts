import {InjectionToken, NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import {HttpClientModule} from "@angular/common/http";
import {IGitUser} from "./shared/interfaces/IGitUser";
import {GitLabService} from "./shared/Services/git-lab.service";
import {AppRoutingModule} from "./app-routing.module";
import { DetailUserComponent } from './pages/detail-user/detail-user.component';

export const IGitApi = new InjectionToken<IGitUser>("Api")

@NgModule({
  declarations: [
    AppComponent,
    DetailUserComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule
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
