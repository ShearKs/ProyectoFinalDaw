import { Directive, Input, TemplateRef, ViewContainerRef } from "@angular/core";

@Directive({
  selector: '[appReservaEstado]',
  standalone: true
})
export class ReservaEstadoDirective {

  @Input() set appReservaEstado([time, recinto]: [string, string]) {
    const ocupado = this.getReserva(time, recinto);
    this.viewContainer.clear();

    this.viewContainer.createEmbeddedView(this.templateRef, {
      $implicit: ocupado,
      time,
      recinto
    });
  }

  // Método que se inyecta desde el componente
  @Input() getReserva!: (time: string, recinto: string) => boolean;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef
  ) {}
}
