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

    const body = { modo: 'read' };

    return this._http.post<any>(`${this.apiUrl}/controlador_${entidad}.php`, body);
  }

  public addEntidad(id: number, entityName: string, entityData: any): Observable<any> {

    const body = { modo: 'create', nombreEntidad: entityName, entityData, id };

    return this._http.post<any>(`${this.apiUrl}/controlador_${entityName}.php`, body);
  }

  public eliminarEntidad(id: number, entidad: string): Observable<any> {

    const body = { modo: 'delete', entidad, id };

    return this._http.post<any>(`${this.apiUrl}/controlador_${entidad}.php`, body);
  }

  public editEntidad(id: number, entityName: string, entidadActualizada: any): Observable<any> {

    const body = { modo: 'edit', entityData: entidadActualizada, nombreEntidad: entityName, id }

    return this._http.post<any>(`${this.apiUrl}/controlador_${entityName}.php`, body);

  }

}
