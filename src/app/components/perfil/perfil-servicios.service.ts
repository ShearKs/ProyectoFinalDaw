import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environmet';



@Injectable({
  providedIn: 'root'
})
export class PerfilServiciosService {

  private baseUrl: string = environment.apiUrl;
  private entidad: string = environment.controllers.perfil;

  private apiUrl = `${this.baseUrl}${this.entidad}`;

  constructor(private readonly _http: HttpClient) { }

  public getUsuario(): Observable<any> {
    return this._http.get<any>(this.apiUrl);
  }
}
