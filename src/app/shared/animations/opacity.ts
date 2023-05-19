import {animate, animation, style} from "@angular/animations";

export const opacity = animation([
  style({
    opacity: '{{ oStart }}',
  }),
  animate(
    '300ms ease',
    style({
      opacity: '{{ oEnd }}',
    })
  )
])
