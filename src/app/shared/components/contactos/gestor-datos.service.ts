import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environmet';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GestorDatosService {


  private apiUrl: string = environment.apiUrl;



  constructor(private readonly _http: HttpClient) { }


  //Método que retorna los diferentes usuarios..
  public getEntidad(entidad: string): Observable<any> {
    return this._http.get<any>(`${this.apiUrl}/controlador_${entidad}.php`);
  }




}
