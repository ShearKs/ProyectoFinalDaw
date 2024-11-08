import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { usuario } from '../../shared/components-shared/contactos/contacto.interface';

@Injectable({
  providedIn: 'root'
})
export class UsuarioDataService {

  //Servicio para manejar la logica de los datos del usuario en sesión..

  private usuarioOb$ = new BehaviorSubject<usuario | null>(this.getUsuarioLocalStorage());

  constructor() { }

  private getUsuarioLocalStorage() {

    const usuarioData = localStorage.getItem('user');
    return usuarioData ? JSON.parse(usuarioData) : null;
  }

  public getUsuario(): Observable<usuario | null> {
    return this.usuarioOb$.asObservable();
  }

  public clearUsuario(): void {
    localStorage.removeItem('user');
    this.usuarioOb$.next(null);
  }



}
