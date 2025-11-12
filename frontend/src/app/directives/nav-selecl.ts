import { Directive, effect, ElementRef, inject, input } from '@angular/core';

@Directive({
  selector: '[appNavSelecl]'
})
export class NavSelecl {
  isActive = input(false);
  el = inject(ElementRef);

  styleEffect = effect(() => {
    console.log(this.isActive());
    if (this.isActive()) {
      this.el.nativeElement.classList.add('text-primary');
      this.el.nativeElement.classList.remove('text-muted');
    } else {
      this.el.nativeElement.classList.add('text-muted');
      this.el.nativeElement.classList.remove('text-primary');
    }
  })

}
