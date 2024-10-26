import { Component, Inject, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [MatDialogContent, MatDialogModule, MatButtonModule, MatDialogActions],
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.scss'
})
export class ConfirmDialogComponent {

  @Input() titulo: string = 'Confirmación';
  @Input() contenido: string = 'Tienes que introducir algo al modal';
  @Input() textoConfirmacion: string = 'Ok';

  constructor(
    //Objeto de referencia al diálogo que se está mostrando...
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    //Objeto que contiene los datos que se pasan al diálogo cuando se abre...
    @Inject(MAT_DIALOG_DATA) public data: { titulo: string, contenido: string, textoConfirmacion: string }
  ) {}

  public confirmar(): void {
    this.dialogRef.close(true);
  }

  public cancelar(): void {
    this.dialogRef.close(false);
  }

}
