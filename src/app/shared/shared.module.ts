import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BackComponent } from './components/back/back.component';
import {RouterLink} from "@angular/router";
import { DayPipe } from './pipes/day.pipe';
import { TimePipe } from './pipes/time.pipe';
import { ErrorComponent } from './components/error/error.component';

@NgModule({
  declarations: [
    BackComponent,
    DayPipe,
    TimePipe,
    ErrorComponent,
  ],
  exports: [
    BackComponent,
    DayPipe,
    TimePipe,
    ErrorComponent
  ],
  imports: [
    CommonModule,
    RouterLink,

  ]
})
export class SharedModule { }
