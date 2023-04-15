import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HeaderComponent} from "./components/header/header.component";
import {MainComponent} from './components/main/main.component';
import {CardComponent} from './components/card/card.component';
import {AppRoutingModuleSearch} from "./AppRoutingModuleSearch";


@NgModule({
  declarations: [
    HeaderComponent,
    MainComponent,
    CardComponent
  ],
  imports: [
    CommonModule,
    AppRoutingModuleSearch
  ],
  bootstrap: [MainComponent]
})
export class MainPageModule {
}
