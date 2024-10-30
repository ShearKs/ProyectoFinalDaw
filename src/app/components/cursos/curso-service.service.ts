import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environmet';
import { Observable } from 'rxjs';
import { Curso } from './interfaces/curso.interface';
import { Inscripcion } from './interfaces/inscripciones.interface';

@Injectable({
  providedIn: 'root'
})
export class CursoServiceService {

  private apiUrl: string = environment.apiUrl;
  private cursosEndPoint: string = `${this.apiUrl}/controlador_${environment.controllers.curso}`;

  constructor(private readonly _http: HttpClient) { }

  //Devuelve todos los cursos desponibles y las plazas disponibles...
  public getCursos(): Observable<any> {

    return this._http.get<any>(`${this.cursosEndPoint}.php?modo='getCurso'`);
  }

  //Método que lo utilizará el administrador ..
  public addCurso(nuevoCurso: Curso): Observable<any> {

    return this._http.post<any>(`${this.cursosEndPoint}.php`, { modo: 'addCurso', nuevoCurso });

  }

  public anadirInscripcion(nuevaInscripcion: Inscripcion): Observable<any> {

    return this._http.post<any>(`${this.cursosEndPoint}.php`, { modo: 'addInscripcion', nuevaInscripcion });
  }





}
