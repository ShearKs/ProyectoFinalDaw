import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environmet';
import { HttpClient } from '@angular/common/http';
import { Evento } from './interfaces/evento.interface';
import { Inscripcion } from './interfaces/inscripcion.interface';


@Injectable({
  providedIn: 'root'
})
export class EventosService {

  private apiUrl: string = environment.apiUrl;
  private eventosEndPoint: string = environment.controllers.eventos

  constructor(private readonly __http: HttpClient) { }

  //Función para obtener las reservas
  public getEventos(idCliente: number): Observable<any[]> {
    return this.__http.post<any>(`${this.apiUrl}/${this.eventosEndPoint}`, { modo: 'getEventos', data: {idCliente} });

  }

  //Para inscribirnos a los cursos (lo hace el cliente)
  public inscripcion(inscripcion: Inscripcion) {
    return this.__http.post<any>(`${this.apiUrl}/${this.eventosEndPoint}`, { modo: 'inscripcion', data: {inscripcion} });
  }

  //Funciones que usuario el administrador
  public addEvento(evento: Evento): Observable<any> {
    return this.__http.post<any>(`${this.apiUrl}/${this.eventosEndPoint}`, { modo: 'addEvento', data: { evento } })
  }

  public deleteEvento(idEvento: number): Observable<any> {
    return this.__http.post<any>(`${this.apiUrl}/${this.eventosEndPoint}`, { modo: 'deleteEvento', data: { idEvento } });
  }

  public editEvento(evento: Evento): Observable<any> {
    return this.__http.post<any>(`${this.apiUrl}/${this.eventosEndPoint}`, { modo: 'editEvento', data: { evento } });
  }



}
