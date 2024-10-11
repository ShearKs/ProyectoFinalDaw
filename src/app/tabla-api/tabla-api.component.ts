import { Component, OnInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { ServicioApiService } from '../servicio-api.service';
import { tap } from 'rxjs/operators';
import { Persona } from '../persona';
import { TablaInformacionComponent } from './tabla-informacion/tabla-informacion.component';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'app-tabla-api',
    standalone: true,
    templateUrl: './tabla-api.component.html',
    styleUrl: './tabla-api.component.scss',
    providers: [ServicioApiService],
    imports: [MatTableModule, MatDialogModule, MatButtonModule, TablaInformacionComponent]
})
export class TablaApiComponent implements OnInit {

  public displayedColumns: string[] = ['id', 'idUsuario', 'nombre', 'completado', 'ver'];
  //Array vacio con todo lo que nos da la api
  public listaPersonas: Persona[] = [];

  constructor(
    private readonly _apiCall: ServicioApiService,
    private readonly _dialog: MatDialog,
  ) { }
  ngOnInit(): void {

    this._apiCall.obtenerInfo().
      pipe(
        tap((resultado: Persona[]) => {

          this.listaPersonas = resultado.filter(persona => persona.completed && persona.userId === 10)
          console.log("Resultado de lo que nos da la api")
          console.log(resultado)
        })
      )
      .subscribe();
  }

  public mostrarDialogo(persona: Persona) {

    const dialog = this._dialog.open(
      TablaInformacionComponent,
      {
        width: '250px',
        data: { ...persona }
      },
    );
    dialog.afterClosed().subscribe(result => {
      console.log('El dialogo ha sido cerrado');
      console.log('Resultado mostrado: ', result)
    })
  }
}
