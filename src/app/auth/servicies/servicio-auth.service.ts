import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ServicioAuthService {

  public contrasenaOculta: boolean = true;

  constructor() {}

  public mostrarContrasena(event: Event): void {
    event.preventDefault();
    this.contrasenaOculta = !this.contrasenaOculta;
  }

  public esVisiblePass():string{

    return this.contrasenaOculta ? "visibility_off" : 
      "visibility";
  }


}
