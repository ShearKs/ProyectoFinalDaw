import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environmet';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReservasService {

  private apiUrl: string = environment.apiUrl;
  private reservasEndpoint : string = environment.controllers.reservas

  constructor(private readonly __http: HttpClient) { }

  //Función para obtener las reservas
  public getReservas(idDeporte: number) : Observable<any[]> {
    return this.__http.get<any>(`${this.apiUrl}/${this.reservasEndpoint}.php?idDeporte=${idDeporte}`)
  }




}
