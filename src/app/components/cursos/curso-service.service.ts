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
  private cursosEndPoint: string = `${this.apiUrl}/controlador_${environment.controllers.cursos}`;

  constructor(private readonly _http: HttpClient) { }

  //Devuelve todos los cursos desponibles y las plazas disponibles...
  public getCursos(idCliente: number): Observable<any> {

    return this._http.post<any>(`${this.cursosEndPoint}.php`, { modo: 'getCurso', idCliente });
  }

  //Método que lo utilizará el administrador para añadir un nuevo curso desde la aplicación ..
  public addCurso(nuevoCurso: Curso): Observable<any> {

    return this._http.post<any>(`${this.cursosEndPoint}.php`, { modo: 'addCurso', nuevoCurso });

  }

  public editarCurso(cursoEditado: Curso): Observable<any> {
    return this._http.post(`${this.cursosEndPoint}.php`, { modo: 'editarCurso', cursoEditado });
  }


  public anadirInscripcion(nuevaInscripcion: Inscripcion): Observable<any> {

    return this._http.post<any>(`${this.cursosEndPoint}.php`, { modo: 'addInscripcion', inscripcion: nuevaInscripcion });
  }




}
