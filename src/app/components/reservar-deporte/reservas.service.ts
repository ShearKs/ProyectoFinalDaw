import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environmet';
import { Observable } from 'rxjs';
import { Reserva } from './reserva.interface';

@Injectable({
  providedIn: 'root'
})
export class ReservasService {

  private apiUrl: string = environment.apiUrl;
  private reservasEndpoint: string = environment.controllers.reservas

  constructor(private readonly __http: HttpClient) { }

  //Función para obtener las reservas
  public getReservas(idDeporte: number,fecha :Date): Observable<any[]> {
    return this.__http.post<any>(`${this.apiUrl}/controlador_${this.reservasEndpoint}.php`, { modo: 'getReservas', idDeporte ,fecha})
  }

  //Para recoger las pistas de ese deporte determinado
  public getPistas(idDeporte: number): Observable<any> {
    return this.__http.post<any>(`${this.apiUrl}/controlador_${this.reservasEndpoint}.php`, { modo: 'getPistas', idDeporte })
  }

  //Para recoger el horario que tiene un deporte..
  public getHorario(idDeporte: number): Observable<any> {

    return this.__http.post<any>(`${this.apiUrl}/controlador_${this.reservasEndpoint}.php`, { modo: 'getHorario', idDeporte });
  }

  public hacerReserva(reserva: Reserva): Observable<any> {

    return this.__http.post<any>(`${this.apiUrl}/controlador_${this.reservasEndpoint}.php`, { modo: 'hacerReserva', reserva });
  }




}
