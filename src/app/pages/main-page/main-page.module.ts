import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HeaderComponent} from "./components/header/header.component";
import {MainComponent} from './components/main/main.component';
import {CardComponent} from './components/card/card.component';
import {AppRoutingGitLabUsersModule} from "./app-routing-git-lab-users.module";


@NgModule({
  declarations: [
    HeaderComponent,
    MainComponent,
    CardComponent
  ],
  imports: [
    CommonModule,
    AppRoutingGitLabUsersModule
  ],
  bootstrap: [MainComponent] // так же здесь будем провайдить сервис или Akita store в которым будем хранить данные)() либо localstorage если буде лень делать
})
export class MainPageModule {
}
