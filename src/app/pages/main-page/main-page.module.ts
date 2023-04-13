import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {HeaderComponent} from "./components/header/header.component";
import { MainComponent } from './components/main/main.component';
import { CardComponent } from './components/card/card.component';



@NgModule({
  declarations: [
    HeaderComponent,
    MainComponent,
    CardComponent
  ],
  imports: [
    CommonModule
  ]
})
export class MainPageModule { }
