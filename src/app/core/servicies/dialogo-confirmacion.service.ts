import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../shared/components-shared/confirm-dialog/confirm-dialog.component';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DialogoConfirmacionService {

  constructor(private _dialog: MatDialog) { }


   // Método para abrir el diálogo de confirmación y devolver el resultado como Observable
   public abrirConfirmacion(titulo: string, contenido: string, textoConfirmacion: string): Observable<boolean> {
    const dialogRef = this._dialog.open(ConfirmDialogComponent, {
      data: {
        titulo: titulo,
        contenido: contenido,
        textoConfirmacion: textoConfirmacion
      }
    });

    // Retornamos el Observable que se emite cuando se cierra el diálogo
    return dialogRef.afterClosed();
  }




}
