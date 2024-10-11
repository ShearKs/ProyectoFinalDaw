import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FormPruebaService {

  private apiUrl = 'https://tu-dominio.com/tu-archivo.php';

  constructor(private http: HttpClient) {}

  public enviarFormulario(datos: any) {
    return this.http.post(this.apiUrl, datos);
  }
}
