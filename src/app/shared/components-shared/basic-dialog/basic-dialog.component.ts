import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogContainer, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-basic-dialog',
  standalone: true,
  imports: [MatDialogModule,MatButtonModule,MatDialogContainer ,CommonModule],
  templateUrl: './basic-dialog.component.html',
  styleUrl: './basic-dialog.component.scss'
})
export class BasicDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<BasicDialogComponent>,

    @Inject(MAT_DIALOG_DATA) public data: { correcto: boolean, mensaje: string }
  ) {}

  ngOnInit(): void {
    console.log('Diálogo básico abierto')
    console.log('Correcto : ',this.data.correcto)
  }

  public cerrarDialogo(){
    this.dialogRef.close(true)
  }
}
