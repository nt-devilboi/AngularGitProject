import {animate, animation, style} from "@angular/animations";

export const transformOpacity = animation([
  style({
    opacity: '{{ oStart }}',
    transform: '{{ transformStart }}'
  }),
  animate(
    '300ms ease',
    style({
      opacity: '{{ oEnd }}',
      transform: '{{ transformEnd }}'
    })
  )
])
