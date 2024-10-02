import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServicioApiService {

  //Ruta de la que vamos a sacar la información de la api
  public api : string = 'https://jsonplaceholder.typicode.com/todos/';

  constructor(

    private readonly _http : HttpClient,
  ) {}

  public obtenerInfo() : Observable<any>{
    return this._http.get<any>(this.api);
  }

  public obtenerElemento(id: number): Observable<any>{

    return this._http.get<any>(`${this.api}/${id}`);

  }


}
