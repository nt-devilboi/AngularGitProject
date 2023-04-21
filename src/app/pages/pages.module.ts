import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import {HeaderComponent} from "./main-page/components/header/header.component";
import {MainPageComponent} from "./main-page/main-page.component";
import {CardComponent} from "./main-page/components/card/card.component";
import {BodyComponent} from "./main-page/components/body/body.component";
import {UserPageComponent} from "./user-page/user-page.component";
import {ComparePageComponent} from './compare-page/compare-page.component';
import {NotFoundPageComponent} from './not-found-page/not-found-page.component';
import {CardsComponent} from './main-page/components/cards/cards.component';
import {SearchResultComponent} from './main-page/components/search-result/search-result.component';

const routes: Routes = [
  {
    path: '', component: MainPageComponent, children: [
      {
        path: '', component: CardsComponent
      },
      {
        path: 'search-result', component: SearchResultComponent
      }
    ]
  },
  {
    path: "user/:id", component: UserPageComponent,
  },
  {
    path: 'compare', component: ComparePageComponent
  },
]

@NgModule({
  declarations: [
    HeaderComponent,
    MainPageComponent,
    CardComponent,
    BodyComponent,
    MainPageComponent,
    UserPageComponent,
    ComparePageComponent,
    NotFoundPageComponent,
    CardsComponent,
    SearchResultComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ],
  exports: [
    RouterModule,
    MainPageComponent
  ],
  // так же здесь будем провайдить сервис или Akita store в которым будем хранить данные)() либо localstorage если буде лень делать
})
export class PagesModule {
}