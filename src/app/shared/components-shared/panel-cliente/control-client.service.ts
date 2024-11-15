import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environmet';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ControlClientService {

  private apiUrl: string = environment.apiUrl;
  private panelControlEndPoint: string = environment.controllers.panel_control

  constructor(private readonly _http: HttpClient) { }

  public getReservasUsuario(idUsuario: number): Observable<any[]> {
    return this._http.post<any>(`${this.apiUrl}/${this.panelControlEndPoint}.php`, { modo: 'getReservasUsuario', idCliente: idUsuario });
  }

  public getCursosUsuario(idUsuario: number): Observable<any[]> {
    return this._http.post<any>(`${this.apiUrl}/${this.panelControlEndPoint}.php`, { modo: 'getCursosUsuario', idCliente: idUsuario });
  }

  public getInscripcionesEventos(idUsuario: number): Observable<any[]> {
    return this._http.post<any>(`${this.apiUrl}/${this.panelControlEndPoint}.php`, { modo: 'getInscripEventos', idCliente: idUsuario });
  }


}
