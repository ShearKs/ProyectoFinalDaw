import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { Evento } from '../interfaces/evento.interface';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatDivider } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import * as L from 'leaflet';
import { MatButtonModule } from '@angular/material/button';
import { usuario } from '../../../shared/components-shared/contactos/contacto.interface';
import { EventosService } from '../eventos.service';
import { tap } from 'rxjs';
import { DialogoService } from '../../../core/servicies/dialogo.service';
import { Inscripcion } from '../interfaces/inscripcion.interface';
import { ConfirmDialogComponent } from '../../../shared/components-shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-inscripcion-evento',
  standalone: true,
  imports: [MatCardModule, CommonModule, MatDivider, MatIconModule, MatButtonModule],
  templateUrl: './inscripcion-evento.component.html',
  styleUrl: './inscripcion-evento.component.scss'
})
export class InscripcionEventoComponent implements OnInit, AfterViewInit {

  //Evento que ha clicado el usuario y de el que le vamos a mostrar más información
  public evento !: Evento;
  private map: L.Map | undefined;

  public usuario !: usuario;

  constructor(
    //Datos que nos viene desde el diálogo..
    @Inject(MAT_DIALOG_DATA) public data: any,
    private readonly _apiEvento: EventosService,
    private readonly _dialog: MatDialog,
    private readonly _dialogMensaje: DialogoService,


  ) { }
  ngAfterViewInit(): void {
    this.iniciarMapa();
  }

  ngOnInit(): void {

    this.usuario = JSON.parse(localStorage.getItem('user') || '{}');

    this.evento = this.data.datos.evento;
    // console.log('Evento que hemos recibido...')
    console.log(this.evento)
  }

  //Que el usuario se apunte al evento..
  public incribirse(): void {

    const inscripcion: Inscripcion = {
      idCliente: this.usuario.id!, idEvento: this.evento.id,
    }

    const dialog = this._dialog.open(ConfirmDialogComponent, {
      data: {
        titulo: 'Confirmación de inscripción al evento',
        contenido: `¿Estás seguro que quieres inscribirte al evento?`,
        textoConfirmacion: 'Inscribirse',
      }
    });

    dialog.afterClosed().subscribe(result => {

      if (result) {
        this._apiEvento.inscripcion(inscripcion).pipe(
          tap((response => {
            if (response.status === 'exito') {
              this._dialogMensaje.abrirDialogoConfirmacion(`Se ha realizado la inscripción ${this.usuario.nombre}!`, true);
              
            }
          }))

        ).subscribe();
      }
    });


  }

  private iniciarMapa() {

    //Asignamos las coordenadas del evento
    const lat = this.evento.latitud ? this.evento.latitud : 38.9942;
    const lng = this.evento.longitud ? this.evento.longitud : -1.8564;

    this.map = L.map('map').setView([lat, lng], 18);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);

    L.marker([lat, lng]).addTo(this.map)
      .bindPopup(this.evento.nombre)
      .openPopup();
  }

}




