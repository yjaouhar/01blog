import { Directive, effect, ElementRef, inject, input } from '@angular/core';

@Directive({
  selector: '[appLikeDirective]'
})
export class LikeDirective {

  like = input(false);
  el = inject(ElementRef);

  styleEffect = effect(() => {
    if (this.like()) {
      this.el.nativeElement.classList.remove("bi-heart");
      this.el.nativeElement.classList.add("bi-heart-fill", "text-danger");
    } else {
      this.el.nativeElement.classList.remove("bi-heart-fill", "text-danger");
      this.el.nativeElement.classList.add("bi-heart");

    }
  })

}
