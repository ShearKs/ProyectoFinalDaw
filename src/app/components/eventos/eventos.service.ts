import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environmet';
import { HttpClient } from '@angular/common/http';
import { Evento } from './interfaces/evento.interface';

@Injectable({
  providedIn: 'root'
})
export class EventosService {

  private apiUrl: string = environment.apiUrl;
  private eventosEndPoint: string = environment.controllers.eventos

  constructor(private readonly __http: HttpClient) { }

  //Función para obtener las reservas
  public getEventos(): Observable<any[]> {
    return this.__http.post<any>(`${this.apiUrl}/${this.eventosEndPoint}`, { modo: 'getEventos', data: null });

  }

  public addEvento(evento: Evento): Observable<any> {
    return this.__http.post<any>(`${this.apiUrl}/${this.eventosEndPoint}`, { modo: 'addEvento', data: { evento } })
  }





}
