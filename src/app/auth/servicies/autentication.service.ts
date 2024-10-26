import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environmet';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from '../interfaces/usuario.interface';
import { LoginResponse } from '../interfaces/loginresponse.interface';


@Injectable({
  providedIn: 'root'
})
export class AutenticationService {

  private apiUrl: string = environment.apiUrl;
  private authEndPoint: string = environment.controllers.autenticacion;


  constructor(private readonly _http: HttpClient) { }

  public login(username: string, password: string): Observable<LoginResponse> {

    return this._http.post<LoginResponse>(`${this.apiUrl}/${this.authEndPoint}.php`, { modo: 'login', data: { username, password } });

  }

  public crearUsuario(nuevoUsuario: Usuario): Observable<any> {

    return this._http.post<LoginResponse>(`${this.apiUrl}/${this.authEndPoint}.php`, { modo: 'registro', data: nuevoUsuario });
  }

  public isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }


  public cerrarSesion(): void {

    localStorage.removeItem('token');
  }


}
