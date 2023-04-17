import {InjectionToken, NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import {HttpClientModule} from "@angular/common/http";
import {IGitUser} from "./shared/interfaces/IGitUser";
import {GitLabService} from "./shared/Services/git-lab.service";
import {AppRoutingModule} from "./app-routing.module";
import { DetailUserComponent } from './pages/detail-user/detail-user.component';
import {RouterModule, Routes} from "@angular/router";
import {MainComponent} from "./pages/main-page/components/main/main.component";

export const IGitApi = new InjectionToken<IGitUser>("Api")
const routes: Routes = [
  {
    path: '', component: MainComponent,
  },
  {
    path: "user/:id", component: DetailUserComponent, pathMatch: "prefix"
  }
]

@NgModule({
  declarations: [
    AppComponent,
    DetailUserComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
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
