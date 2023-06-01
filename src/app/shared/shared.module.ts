import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BackComponent } from './components/back/back.component';
import {RouterLink} from "@angular/router";



@NgModule({
  declarations: [
    BackComponent
  ],
  exports: [
    BackComponent
  ],
  imports: [
    CommonModule,
    RouterLink,

  ]
})
export class SharedModule { }
