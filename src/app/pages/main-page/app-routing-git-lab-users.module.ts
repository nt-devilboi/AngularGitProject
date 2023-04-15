import {NgModule} from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {MainComponent} from "./components/main/main.component";
import {DetailUserComponent} from "../detail-user/detail-user.component";


const routes: Routes = [
  {
    path: '', component: MainComponent,
  },
  {
    path: "user/:id", component: DetailUserComponent, pathMatch: "prefix"
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppRoutingGitLabUsersModule {
}
