import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environmet';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { Usuario } from '../interfaces/usuario.interface';
import { LoginResponse } from '../interfaces/loginresponse.interface';

@Injectable({
  providedIn: 'root'
})
export class AutenticationService {
  private apiUrl: string = environment.apiUrl;
  private authEndPoint: string = environment.controllers.autenticacion;

  // BehaviorSubject para mantener y emitir el estado de autenticación
  private loginStatusSubject = new BehaviorSubject<boolean>(this.isLoggedIn());
  public loginStatus$ = this.loginStatusSubject.asObservable(); // Observable para suscribirse

  constructor(private readonly _http: HttpClient) { }

  public login(username: string, password: string): Observable<LoginResponse> {
    return this._http.post<LoginResponse>(`${this.apiUrl}/${this.authEndPoint}.php`, { modo: 'login', data: { username, password } }).pipe(
      tap(respuesta => {
        if (respuesta.success) {
          localStorage.setItem('token', respuesta.token!);
          localStorage.setItem('user', respuesta.user);
          this.loginStatusSubject.next(true); // Emitir que el usuario está autenticado
        }
      })
    );
  }

  public crearUsuario(nuevoUsuario: Usuario): Observable<any> {
    return this._http.post<LoginResponse>(`${this.apiUrl}/${this.authEndPoint}.php`, { modo: 'registro', data: nuevoUsuario });
  }

  public isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  public cerrarSesion(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('fechaHoy');
    localStorage.removeItem('user');
    this.loginStatusSubject.next(false); // Emitir que el usuario ha cerrado sesión
  }
}
