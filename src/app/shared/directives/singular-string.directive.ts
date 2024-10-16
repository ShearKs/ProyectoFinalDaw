import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appSingularString]',
  standalone: true
})
export class SingularStringDirective {

  constructor(private el: ElementRef) { }

  @HostListener('input', ["$event.target.value"])

  onInput(value: string): void {


    this.el.nativeElement.value = value.replace(/s$/, '');
  }

  // Método para actualizar el contenido del elemento
  updateContent(): void {
    const currentValue = this.el.nativeElement.innerText || this.el.nativeElement.value;
    this.el.nativeElement.innerText = currentValue.replace(/s$/, '');
  }


}
