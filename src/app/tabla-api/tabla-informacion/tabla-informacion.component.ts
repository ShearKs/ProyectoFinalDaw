import { Component, inject, Inject, Input, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogModule,
  MatDialog,
} from '@angular/material/dialog';
import { ServicioApiService } from '../../servicio-api.service';
import { Persona } from '../../persona';
import { ActivatedRoute } from '@angular/router';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-tabla-informacion',
  standalone: true,
  imports: [MatDialogContent, MatDialogActions, MatDialogModule, MatButtonModule],
  templateUrl: './tabla-informacion.component.html',
  styleUrl: './tabla-informacion.component.scss',
  providers: [ServicioApiService]
})
export class TablaInformacionComponent implements OnInit {

  public id !: number;
  public personaDatos !: Persona;

  @Input() datos: string = '';

  ////Esto que es??????????
  private readonly _dialog = inject(MatDialog);

  constructor(
    private readonly _route: ActivatedRoute,
    public dialogRef: MatDialogRef<TablaInformacionComponent>,
    private readonly _api: ServicioApiService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit(): void {
    
    console.log(this.datos)

    if (this.data) {

      this._api.obtenerElemento(this.data.id)
        .pipe(
          tap((result => {
            this.personaDatos = result;
          }))
        )
        .subscribe()
    }
  }

  public cerrarDialogo(): void {
    //console.log('Intento de cerrar el diálogo')
    this.dialogRef.close();
  }

}
