import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environmet';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DeportesService {

  private apiUrl: string = environment.apiUrl;
  private deporteEndpoind : string = environment.controllers.obtenerDeporte;

  constructor(private readonly _http:HttpClient) { }


  public getDeportes() :Observable<any[]>{
    return this._http.get<any[]>(`${this.apiUrl}/${this.deporteEndpoind}.php`)
  }




}
