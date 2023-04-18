import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import {HeaderComponent} from "./main-page/components/header/header.component";
import {MainPageComponent} from "./main-page/main-page.component";
import {CardComponent} from "./main-page/components/card/card.component";
import {BodyComponent} from "./main-page/components/body/body.component";
import {UserPageComponent} from "./user-page/user-page.component";

const routes: Routes = [
  {
    path: '', component: MainPageComponent,
  },
  {
    path: "user/:id", component: UserPageComponent, pathMatch: "prefix"
  }
]

@NgModule({
  declarations: [
    HeaderComponent,
    MainPageComponent,
    CardComponent,
    BodyComponent,
    MainPageComponent,
    UserPageComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ],
  exports: [
    RouterModule
  ],
  // так же здесь будем провайдить сервис или Akita store в которым будем хранить данные)() либо localstorage если буде лень делать
})
export class MainPageModule {
}
