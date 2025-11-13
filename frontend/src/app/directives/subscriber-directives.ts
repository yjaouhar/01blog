import { Directive, effect, ElementRef, inject, input } from '@angular/core';

@Directive({
  selector: '[appSubscriberDirectives]'
})
export class SubscriberDirectives {

  subscrib = input(false);
  el = inject(ElementRef);

  styleEffect = effect(() => {
    if (this.subscrib()) {
      this.el.nativeElement.classList.add("btn-outline-secondary");
      this.el.nativeElement.classList.remove("btn-primary");
    } else {
      this.el.nativeElement.classList.add("btn-primary");
      this.el.nativeElement.classList.remove("btn-outline-secondary");
    }
  })

}
