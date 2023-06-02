import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BackComponent } from './components/back/back.component';
import {RouterLink} from "@angular/router";
import { DayPipe } from './pipes/day.pipe';
import { TimePipe } from './pipes/time.pipe';



@NgModule({
  declarations: [
    BackComponent,
    DayPipe,
    TimePipe,
  ],
  exports: [
    BackComponent,
    DayPipe,
    TimePipe
  ],
  imports: [
    CommonModule,
    RouterLink,

  ]
})
export class SharedModule { }
