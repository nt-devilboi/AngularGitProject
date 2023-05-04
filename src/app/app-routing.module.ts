import {NgModule} from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {NotFoundPageComponent} from "./pages/not-found-page/not-found-page.component";
import {LoginPageComponent} from "./pages/login-page/login-page.component";
import {AuthGuard} from "./shared/guards/auth.guard";


const routes: Routes = [
  {
    path: 'login', component: LoginPageComponent
  },
  {
    path: '', loadChildren: () => import("./pages/pages.module").then(m => m.PagesModule), canActivate: [AuthGuard]
  },
  {
    path: '**', component: NotFoundPageComponent
  }
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
