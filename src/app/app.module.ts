import {ErrorHandler, InjectionToken, NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import {HttpClientModule} from "@angular/common/http";
import {IGitUser} from "./shared/interfaces/IGitUser";
import {GitLabService} from "./shared/services/git-lab.service";
import {AppRoutingModule} from "./app-routing.module";
import {PagesModule} from "./pages/pages.module";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {UserStorageService} from "./shared/services/user-storage.service";
import {CardComponent} from "./shared/components/card/card.component";
import {ErrorService} from "./shared/services/error.service";
import {SharedModule} from "./shared/shared.module";

export const IGitApi = new InjectionToken<IGitUser>("Api")
export const userStore = new InjectionToken("store")

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    PagesModule,
    BrowserAnimationsModule,
    CardComponent,
    SharedModule
  ],
  exports: [
  ],
  providers: [
    {
      provide: IGitApi,
      useClass: GitLabService
    },
    {
      provide: userStore,
      useExisting: UserStorageService
    },
    {
      provide: ErrorHandler,
      useExisting: ErrorService
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
