import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServicioCargaService {

  private cargaSubject$ = new BehaviorSubject<boolean>(false);
  public cargaObs$ = this.cargaSubject$.asObservable();

  constructor() { }

  public muestra(){
    this.cargaSubject$.next(true);
  }

  public ocultar(){
    this.cargaSubject$.next(false);
  }
}
