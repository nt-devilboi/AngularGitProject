import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import {HeaderComponent} from "./main-page/components/header/header.component";
import {MainPageComponent} from "./main-page/main-page.component";
import {BodyComponent} from "./main-page/components/body/body.component";
import {UserPageComponent} from "./user-page/user-page.component";
import {ComparePageComponent} from './compare-page/compare-page.component';
import {NotFoundPageComponent} from './not-found-page/not-found-page.component';
import {SearchResultComponent} from './main-page/components/search-result/search-result.component';
import {FormsModule, ReactiveFormsModule } from '@angular/forms';
import {LoginPageComponent} from "./login-page/login-page.component";
import {CardComponent} from "../shared/components/card/card.component";
import {SharedModule} from "../shared/shared.module";
import {ColorCountDirective} from "../shared/directives/color-count.directive";
import {PrivateProfileDirective} from "../shared/directives/private-profile.directive";
import {CompareGuard} from "./compare-page/guards/compare.guard";

const routes: Routes = [
  {
    path: '', component: MainPageComponent, children: [
      {
        path: '', component: BodyComponent
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
    path: 'compare', component: ComparePageComponent, canActivate: [CompareGuard]
  },
]

@NgModule({
  declarations: [
    HeaderComponent,
    MainPageComponent,
    BodyComponent,
    MainPageComponent,
    UserPageComponent,
    ComparePageComponent,
    NotFoundPageComponent,
    SearchResultComponent,
    LoginPageComponent,
  ],
  providers: [

  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forChild(routes),
    CardComponent,
    SharedModule,
    ColorCountDirective,
    PrivateProfileDirective
  ],
  exports: [
    RouterModule,
    MainPageComponent
  ],
  // так же здесь будем провайдить сервис или Akita store в которым будем хранить данные)() либо localstorage если буде лень делать
})
export class PagesModule {
}
