import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environmet';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LugaresService {

  private apiUrl: string = environment.apiUrl;
  private lugaresEndpoint : string = environment.controllers.obtenerLugares;

  constructor(private http: HttpClient) {}

  getLugares(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${this.lugaresEndpoint}.php`);  // Cambia la URL según tu backend
  }



}
