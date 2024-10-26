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

    const body = { modo: 'read', entidad };

    return this._http.post<any>(`${this.apiUrl}/controlador_${entidad}.php`, body);
  }

  public addEntidad(entityName: string, entityData: any): Observable<any> {

    const body = { modo: 'create', entidad: entityName, entityData: entityData };
    return this._http.post<any>(`${this.apiUrl}/controlador_${entityName}.php`, body);
  }

  public eliminarEntidad(id: number, entidad: string): Observable<any> {

    const body = { modo: 'delete', entidad, id };

    return this._http.post<any>(`${this.apiUrl}/controlador_${entidad}.php`, body);
  }

  public editEntidad(id: number, entityName: string, entidadActualizada: any): Observable<any> {
    console.log('Estoy en el edit mi gente')

    const body = { modo: 'update', entidad: entityName,entityData: entidadActualizada, nombreEntidad: entityName, id }

    return this._http.post<any>(`${this.apiUrl}/controlador_${entityName}.php`, body);

  }

}
