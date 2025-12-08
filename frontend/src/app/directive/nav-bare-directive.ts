import { Directive, effect, ElementRef, inject, input } from '@angular/core';

@Directive({
  selector: '[appNavBareDirective]'
})
export class NavBareDirective {

  select = input(false)
  el = inject(ElementRef)

  styleEffect = effect(() => {
    if (this.select()) {
      this.el.nativeElement.style.color = "#0d6efd";
    } else {
      this.el.nativeElement.style.color = "";
    }
  })
}
