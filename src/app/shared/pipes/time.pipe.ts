import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'time'
})
export class TimePipe implements PipeTransform {

  transform(value: number): unknown {
    let startHour = `${value < 10 ? '0' : ''}${value}:00`
    value += 1
    value = value == 24 ? 0 : value
    let endHour = `${value < 10 ? '0' : ''}${value}:00`

    return `с ${startHour} до ${endHour}`;
  }

}
