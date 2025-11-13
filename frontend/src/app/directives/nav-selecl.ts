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
      this.el.nativeElement.style.color = '#059669';  
    } else {
      this.el.nativeElement.style.color = '#9ca3af';  

    }
  })

}
