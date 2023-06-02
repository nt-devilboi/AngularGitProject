import {Directive, ElementRef, inject, Input, OnInit} from '@angular/core';

@Directive({
  selector: '[appColorCount]',
  standalone: true
})
export class ColorCountDirective implements OnInit{
  @Input('appColorCount') public count!: number
  @Input('approved') public isApproved: boolean = false

  private _element: ElementRef = inject(ElementRef)

  constructor() { }

  public ngOnInit(): void {
    let color: string

    if (!this.isApproved) {
      if (this.count >= 900)
        color = 'green'
      else if (this.count >= 300)
        color = 'orange'
      else
        color = 'red'
    } else {
      if (this.count >= 300)
        color = 'green'
      else if (this.count >= 100)
        color = 'orange'
      else
        color = 'red'
    }

    this._element.nativeElement.style.color = color
  }

}
