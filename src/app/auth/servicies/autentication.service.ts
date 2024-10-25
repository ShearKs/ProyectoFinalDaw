import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environmet';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface LoginResponse {

  success: boolean;
  user?: any;
  message?: string,
  token?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AutenticationService {

  private apiUrl: string = environment.apiUrl;
  private loginEndPoint: string = environment.controllers.login;

  constructor(private readonly _http: HttpClient) { }

  public login(username: string, password: string): Observable<LoginResponse> {


    return this._http.post<LoginResponse>(`${this.apiUrl}/${this.loginEndPoint}.php`, { usuario: username, contrasena: password });

  }





}
