import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environmet';
import { Observable } from 'rxjs';
import { Curso } from './curso.interface';

@Injectable({
  providedIn: 'root'
})
export class CursoServiceService {

  private apiUrl: string = environment.apiUrl;
  private cursosEndPoint: string = environment.controllers.curso;

  constructor(private readonly _http: HttpClient) { }


  public getCursos(): Observable<any> {

    return this._http.get<any>(`${this.apiUrl}/controlador_${this.cursosEndPoint}.php?modo='read'`);
  }

  public addCurso(nuevoCurso: Curso): Observable<any> {

    return this._http.post<any>(`${this.apiUrl}/controlador_${this.cursosEndPoint}`, { modo: 'add', nuevoCurso });

  }





}
