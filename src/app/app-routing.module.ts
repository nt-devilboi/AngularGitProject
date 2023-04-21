import {NgModule} from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {NotFoundPageComponent} from "./pages/not-found-page/not-found-page.component";


const routes: Routes = [
  {
    path: '', loadChildren: () => import("./pages/pages.module").then(m => m.PagesModule)
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
