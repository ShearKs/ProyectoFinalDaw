import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { EventosService } from './eventos.service';
import {  tap } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { UsuarioDataService } from '../../core/servicies/usuario-data.service';
import { usuario } from '../../shared/components-shared/contactos/contacto.interface';
import { MatDialog } from '@angular/material/dialog';
import { EmptyDialogComponent } from '../../shared/components-shared/empty-dialog/empty-dialog.component';
import { FormularioDinamicoComponent } from '../../shared/components-shared/formulario-dinamico/formulario-dinamico.component';
import { CampoFormulario } from '../../shared/components-shared/formulario-dinamico/interfaces/campos_formulario.interface';
import { DeportesService } from '../../core/servicies/deportes.service';
import { Evento } from './interfaces/evento.interface';
import { DialogoService } from '../../core/servicies/dialogo.service';
import { ConfirmDialogComponent } from '../../shared/components-shared/confirm-dialog/confirm-dialog.component';
import { sameObject } from '../../functions';
import { InscripcionEventoComponent } from './inscripcion-evento/inscripcion-evento.component';

@Component({
  selector: 'app-eventos',
  standalone: true,
  imports: [MatCardModule, CommonModule, MatButtonModule, MatIconModule],
  templateUrl: './eventos.component.html',
  styleUrl: './eventos.component.scss'
})
export class EventosComponent implements OnInit {

  // Usuario que hay en la sesión
  public usuario!: usuario | null;

  public eventos: any = [];

  // Deportes disponibles para seleccionar
  public deportes: { [key: string]: string } = {};

  private camposFormulario: CampoFormulario[] = [
    
    { nombre: 'nombre', tipo: 'text', label: 'Nombre del Evento', requerido: true },
    { nombre: 'plazas_disponibles', tipo: 'number', label: 'Plazas Disponibles', requerido: true },
    { nombre: 'fecha_evento', tipo: 'date', label: 'Fecha del Evento', requerido: true },
    { nombre: 'distancia', tipo: 'text', label: 'Distancia(km)', requerido: true },
    { nombre: 'descripcion', tipo: 'text', label: 'Descripción', requerido: true },
    { nombre: 'idDeporte', tipo: 'select', label: 'Deporte', opciones: [], requerido: false }  // Campo de selección
  ];

  constructor(
    private readonly _eventosCall: EventosService,
    private readonly _deportesCall: DeportesService,
    private readonly _usuarioService: UsuarioDataService,
    private readonly _dialog: MatDialog,
    private readonly _dialogMensaje: DialogoService,
  ) { }

  ngOnInit(): void {
    const userData = localStorage.getItem('user');
    this.usuario = userData ? JSON.parse(userData) : null;

    // Cambiar 'value' por 'valor'
    this._deportesCall.getDeportes().pipe(
      tap((deportesObject) => {
        // Inicializamos el objeto de deportes
        const deportesMap: any = {};

        // Recorrer los deportes y asignarlos al objeto con claves numéricas
        deportesObject.forEach((deporte, index) => {
          deportesMap[index + 1] = deporte.nombre; // Utilizamos el índice + 1 como clave
        });

        // Asignar el objeto de deportes al campo 'idDeporte'
        this.camposFormulario.forEach(campo => {
          if (campo.nombre === 'idDeporte') {
            // Convertir el objeto deportesMap a un formato adecuado para opciones
            campo.opciones = Object.keys(deportesMap).map(key => ({
              valor: key, // La clave (número) como valor
              label: deportesMap[key] // El nombre del deporte como label
            }));

            // Establecer un valor inicial si es necesario
            campo.valorInicial = '1';
          }
        });
      })
    ).subscribe();

    this.cargarEventos();
  }

  public cargarEventos(): void {
    this._eventosCall.getEventos().pipe(
      tap((eventosObtenidos) => {
        console.log('Eventos que llegan...', eventosObtenidos);
        this.eventos = eventosObtenidos;
      })
    ).subscribe();
  }

  // Método para inscribirse a un evento
  public inscribirse(evento: any): void {

    const insEventoEmitter = new EventEmitter<any>();

    const dialogRef = this._dialog.open(EmptyDialogComponent, {
      data: {
        component: InscripcionEventoComponent,
        datos: {
          
        },
        eventEmitter: insEventoEmitter,
      }
    });
  }

  // Acciones para solo el administrador
  public addEvento(): void {
    const nuevoEventoEmitter = new EventEmitter<any>();

    const dialogRef = this._dialog.open(EmptyDialogComponent, {
      data: {
        component: FormularioDinamicoComponent,
        datos: {
          titulo: 'Añadir Evento',
          editable: true,
          campos: this.camposFormulario,
          //Flag para saber si el evento es nuevo..,
          esNuevoEvento: true
        },
        eventEmitter: nuevoEventoEmitter,
      }
    });

    nuevoEventoEmitter.subscribe((evento: Evento) => {
      console.log('Evento que nos llega del formulario: ');
      console.log(evento);

      this._eventosCall.addEvento(evento).pipe(
        tap((result) => {
          console.log('Lo que nos llega del php: ', result);
          if (result.status === 'exito') {
            this._dialogMensaje.abrirDialogoConfirmacion("Se ha añadido correctamente un evento! ", true);
            // Actualizamos la interfaz
            this.cargarEventos();
          }
        })
      ).subscribe();
    });
  }

  public editEvento(evento: Evento): void {
    const editEventoEmitter = new EventEmitter<any>();

    console.log('Evento clicado: ', evento)

    this.camposFormulario.forEach(campo => {

      if (campo.nombre && evento && evento[campo.nombre] !== undefined) {
        campo.valorInicial = evento[campo.nombre];
      }
    });

    const dialogRef = this._dialog.open(EmptyDialogComponent, {
      data: {
        component: FormularioDinamicoComponent,
        datos: {
          titulo: 'Editar Evento',
          editable: true,
          campos: this.camposFormulario,
        },
        eventEmitter: editEventoEmitter,
      }
    });

    // Realizar acciones que nos llega del formulario...
    editEventoEmitter.subscribe((editEvento: Evento) => {
      console.log('Nuevo evento: ')
      console.log(editEvento)

      console.log('Viejo evento: ')
      console.log(evento)

      //Terminar , fallo al cambiar el getEntity...
      if (sameObject(evento, editEvento)) {
        console.log('holaaaa')
        alert('No has cambiado nada..')
        return;
      }

      //Le añadimos al evento el id que contie
      editEvento.id = evento.id

      this._eventosCall.editEvento(editEvento).pipe(

        tap((response => {
          if (response.status === 'exito') {
            this._dialogMensaje.abrirDialogoConfirmacion('Se ha editado el evento correctamente', true);
            //Actualizamos todos los eventos con el actualziado...
            this.cargarEventos();

          }
        }))
      ).subscribe();

    });
  }

  public deleteEvento(evento: Evento): void {
    console.log('Evento seleccionado..', evento);

    // Abrimos el modal y le pasamos el contenido que va a tener
    const dialog = this._dialog.open(ConfirmDialogComponent, {
      data: {
        titulo: 'Confirmación de eliminación de evento',
        contenido: `¿Estás seguro que quieres eliminar el evento: ${evento.nombre}?`,
        textoConfirmacion: 'Eliminar',
      }
    });

    dialog.afterClosed().subscribe(result => {
      if (result) {
        this._eventosCall.deleteEvento(evento.id).pipe(
          tap((response) => {
            response.status === 'exito'
              ? (this._dialogMensaje.abrirDialogoConfirmacion('Se ha eliminado correctamente el evento!', true), this.cargarEventos())
              : this._dialogMensaje.abrirDialogoConfirmacion('Error: No se pudo eliminar el evento.', false);
          })
        ).subscribe();
      }
    });
  }
}
