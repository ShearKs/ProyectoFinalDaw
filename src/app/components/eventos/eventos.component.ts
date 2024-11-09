import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { EventosService } from './eventos.service';
import { firstValueFrom, Observable, tap } from 'rxjs';
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

@Component({
  selector: 'app-eventos',
  standalone: true,
  imports: [MatCardModule, CommonModule, MatButtonModule, MatIconModule],
  templateUrl: './eventos.component.html',
  styleUrl: './eventos.component.scss'
})
export class EventosComponent implements OnInit {

  //usuario que hay en la sesión
  public usuario!: usuario | null;

  public eventos: any = [
    // { titulo: 'Conferencia de Tecnología', descripcion: 'Una conferencia sobre las últimas tendencias en tecnología.', fecha: '2024-11-10' },
    // { titulo: 'Taller de Programación', descripcion: 'Un taller interactivo para aprender programación en Angular.', fecha: '2024-11-15' },
    // { titulo: 'Hackathon Anual', descripcion: 'Competencia de programación de 24 horas para equipos.', fecha: '2024-11-20' },
    // { titulo: 'Meetup de Desarrollo Web', descripcion: 'Un evento de networking para desarrolladores web.', fecha: '2024-11-25' }
  ];

  //Deportes disonibles para seleccionar...
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
    private readonly _dialogConfirm: DialogoService,

  ) { }

  ngOnInit(): void {

    //Alternativa como si fuera una promesa
    //this.usuario = await firstValueFrom(this._usuarioService.getUsuario());
    //EL SERVICIO FUNCIONA RARO YA QUE NO ACTUALIZA CORRECTAMENTE... 
    // this._usuarioService.getUsuario().subscribe((usuarioSesion) => {
    //   if (usuarioSesion) {
    //     this.usuario = usuarioSesion;
    //     console.log('Usuario en la sesión:', this.usuario);
    //   }
    // });

    const userData = localStorage.getItem('user');
    this.usuario = userData ? JSON.parse(userData) : null;


    //Obtenemos todos los deportes que hay actualmente..
    this._deportesCall.getDeportes().pipe(
      tap((deportesObject) => {
        const deporteOptions = deportesObject.map(deporte => ({
          valor: +deporte.id,
          label: deporte.nombre
        }));

        // Encuentra el campo 'deporte' y le asigna las opciones
        // Encuentra el campo 'idDeporte' y le asigna las opciones
        const deporteField = this.camposFormulario.find(campo => campo.nombre === 'idDeporte');
        if (deporteField) {
          deporteField.opciones = deporteOptions;
        }
      })
    ).subscribe();

    this.cargarEventos();
  }

  public cargarEventos(): void {
    this._eventosCall.getEventos().pipe(

      tap((eventosObtenidos => {
        console.log('Eventos que llegan...', eventosObtenidos);
        this.eventos = eventosObtenidos;
      }))
    ).subscribe();
  }

  // Método para inscribirse a un evento
  public inscribirse(evento: any): void {

    const nuevoEventoEmitter = new EventEmitter<any>();


    const dialogRef = this._dialog.open(EmptyDialogComponent, {
      data: {
        component: FormularioDinamicoComponent,
        datos: {
          titulo: 'Añade un evento',
          editable: true,
          campos: this.camposFormulario,
        },
        eventEmitter: nuevoEventoEmitter,
      }
    });


  }

  //Acciones para solo el adminsitrador
  public addEvento() {

    const nuevoEventoEmitter = new EventEmitter<any>();

    const dialogRef = this._dialog.open(EmptyDialogComponent, {
      data: {
        component: FormularioDinamicoComponent,
        datos: {
          titulo: 'Añadir Evento',
          editable: true,
          campos: this.camposFormulario,
        },
        eventEmitter: nuevoEventoEmitter,
      }
    });

    nuevoEventoEmitter.subscribe((evento: Evento) => {

      console.log('Evento que nos llega del formulario: ');
      console.log(evento)

      this._eventosCall.addEvento(evento).pipe(
        tap((result => {
          console.log('Lo que nos llega del php: ', result)
          if (result.status === 'exito') {
            this._dialogConfirm.abrirDialogoConfirmacion("Se ha añadido correctamente un evneto ", true);
            //Actualizamos la interfaz..
            this.cargarEventos();
          }


        }))
      ).subscribe();



    });



  }






}
