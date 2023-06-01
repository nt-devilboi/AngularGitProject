import {Directive, inject, Input, OnInit, TemplateRef, ViewContainerRef} from '@angular/core';

@Directive({
  selector: '[appPrivateProfile]',
  standalone: true
})
export class PrivateProfileDirective implements OnInit{

  @Input()
  appPrivateProfile!: boolean;
  @Input()
  appPrivateProfileElse!: TemplateRef<any>;

  private templateRef = inject(TemplateRef<any>);
  private viewContainerRef = inject(ViewContainerRef);

  constructor() { }

  public ngOnInit(): void {
    if (!this.appPrivateProfile) {
      this.viewContainerRef.createEmbeddedView(this.templateRef)
    } else {
      this.viewContainerRef.createEmbeddedView(this.appPrivateProfileElse)
    }
  }

}
