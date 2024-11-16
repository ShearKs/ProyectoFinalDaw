import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BasicDialogComponent } from '../../shared/components-shared/basic-dialog/basic-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class DialogoMensajeService {

  constructor(private readonly _dialog: MatDialog) { }

  public abrirDialogoConfirmacion(mensaje: string, correcto: boolean) {


    this._dialog.open(BasicDialogComponent, {
      data: {
        mensaje,
        correcto
      }
    })

  }

}
