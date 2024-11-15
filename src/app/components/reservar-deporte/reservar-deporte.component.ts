import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatTableModule } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { Location } from '@angular/common';
import { ReservaEstadoDirective } from './reserva-estado.directive';
import { ReservasService } from './reservas.service';
import { tap } from 'rxjs';
import { Reserva } from './interfaces/reserva.interface';
import { Horario } from './interfaces/horario.interface';
import { MatDatepickerInputEvent, MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule, provideNativeDateAdapter } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { Pista } from './interfaces/pista.interface';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../shared/components-shared/confirm-dialog/confirm-dialog.component';
import { usuario } from '../../shared/components-shared/contactos/contacto.interface';
import { DialogoService } from '../../core/servicies/dialogo.service';
import { fechaToday } from '../../functions';

@Component({
  selector: 'app-reservar-deporte',
  standalone: true,
  imports: [
    MatButtonModule,
    MatCardModule,
    MatExpansionModule,
    MatDividerModule,
    MatGridListModule,
    CommonModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatNativeDateModule,
  ],
  providers: [provideNativeDateAdapter(), DatePipe],
  templateUrl: './reservar-deporte.component.html',
  styleUrls: ['./reservar-deporte.component.scss']
})
export class ReservarDeporteComponent implements OnInit {


  private usuario !: usuario;


  //Id del deporte reservado...
  public deporteId!: number;
  //Nombre del deporte de la reserva..
  public deporteNombre!: string;

  //Horario que transcurre esa reserva..
  public times: string[] = [
    '08:00 - 09:00', '09:00 - 10:00', '10:00 - 11:00',
    '11:00 - 12:00', '12:00 - 13:00', '13:00 - 14:00'
  ];

  public horarios: any = [];

  public horariosOcupados: { [key: string]: boolean } = {};

  public pistas: { id: number, nombre: string }[] = [];

  //Propiedad para almacenar el estado de las reservas.
  public reservasEstado: { [key: string]: boolean } = {}

  public fechaReserva!: Date;

  public reservas: any = [

  ];

  public reservasCargadas: boolean = false;

  //Propiedades minímas y máximas para las reservas
  public fechaMaxima !: Date;
  public fechaMinima !: Date;



  constructor(
    private datePipe: DatePipe,
    private readonly _ruta: ActivatedRoute,
    private readonly _router: Router,
    private readonly location: Location,
    private readonly _apiReservas: ReservasService,
    private readonly _dialog: MatDialog,
    private readonly _dialogMensaje: DialogoService,
  ) { }

  ngOnInit(): void {

    const userData = localStorage.getItem('user');
    this.usuario = userData ? JSON.parse(userData) : null;

    if (this.usuario.tipo_usuario === 'cliente') {
      //La fecha mínima será la de hoy
      this.fechaMinima = new Date();

      //Fecha máxima será como el mismo día siguiente..
      this.fechaMaxima = new Date();
      this.fechaMaxima.setMonth(this.fechaMaxima.getMonth() + 1);
    }


    // Obtener el parámetro de ruta 'nombre' y el 'id' desde queryParams
    this._ruta.paramMap.subscribe(params => {
      this.deporteNombre = params.get('nombre') || 'Nombre desconocido';
    });

    this._ruta.queryParams.subscribe(params => {
      this.deporteId = params['id'] || 0;
    });



  
    this.fechaReserva = new Date(fechaToday());


    this.cargarHorario();
    this.cargarPistas();
    this.cargarReservas()
  }

  //Método que se encarga de cargar todas las reservas que hay en la bdd..
  public cargarReservas(): void {

    const fechaFormateada: string | null = this.datePipe.transform(this.fechaReserva, 'yyyy-MM-dd');
    console.log(fechaFormateada);


    this._apiReservas.getReservas(this.deporteId, fechaFormateada).pipe(
      tap((reservas: Reserva[]) => {
        this.reservas = reservas.map(reserva => ({
          id: reserva.id,
          idPista: reserva.idPista,
          rangoHoras: {
            inicio: reserva.inicio?.slice(0, 5),
            fin: reserva.fin?.slice(0, 5)
          }
        }));
        console.log('Datos de reservas cargadas:', this.reservas);
      })
    ).subscribe({
      next: () => {
        console.log('Carga de reservas completada.');
        this.reservasCargadas = true;

      },
      error: (err) => {
        console.error('Error al cargar las reservas:', err);
      }
    });
  }

  private formatearFecha() {
    const fechaFormateada: string | null = this.datePipe.transform(this.fechaReserva, 'yyyy-MM-dd');
    return fechaFormateada;
  }

  public cargarPistas(): void {
    this._apiReservas.getPistas(this.deporteId).pipe(
      tap((pistas: Pista[]) => {
        this.pistas = pistas.map(pista => ({
          id: pista.id,
          nombre: pista.nombre,
        }))
      })).subscribe();
  }

  public cargarHorario(): void {
    this._apiReservas.getHorario(this.deporteId).pipe(
      tap((horarios: Horario[]) => {
        console.log(horarios)
        this.horarios = horarios.map(horario => ({
          id: horario.id,
          rangoHoras: `${horario.inicio.slice(0, 5)} - ${horario.fin.slice(0, 5)}`
        }));

        console.log('Horarios cargados:', this.horarios);
      })
    ).subscribe({
      next: () => {
        console.log('Carga de horarios completada.');
      },
      error: (err) => {
        console.error('Error al cargar los horarios:', err);
      }
    })
  }

  public getReserva(time: string, recinto: { id: number, nombre: string }): boolean {
    if (!this.reservasCargadas) return false;

    const reservaEncontrada = this.reservas.find((r: any) =>
      r.idPista === recinto.id &&
      this.estaDentroDelRango(time, r.rangoHoras.inicio, r.rangoHoras.fin)
    );
    return !!reservaEncontrada;
  }
  private estaDentroDelRango(time: string, inicio: string, fin: string): boolean {
    const [horaInicio, horaFin] = [inicio, fin].map(h => h.split(':').map(Number));
    const [horaConsulta] = time.split(':').map(Number);

    // Convertimos las horas a minutos para una comparación más fácil
    return (horaConsulta >= horaInicio[0] && horaConsulta < horaFin[0]);
  }

  public reserva(horario: Horario, recinto: { id: number, nombre: string }, ocupado: boolean): void {
    if (ocupado) {
      console.log('Esa pista no está disponible...');
      return;
    }


    if (this.usuario.tipo_usuario === 'cliente') {
      const dialog = this._dialog.open(ConfirmDialogComponent, {
        data: {
          titulo: 'Confirmación de reserva',
          contenido: `¿Estás seguro que quieres realizar la reserva para el ${this.formatearFecha()}? `,
          textoConfirmacion: 'Confirmar',
        }
      });

      dialog.afterClosed().subscribe(result => {
        if (result && this.fechaReserva) {

          const fechaFormateada: string | null = this.datePipe.transform(this.fechaReserva, 'yyyy-MM-dd');

          //Hacemos la reserva
          const reserva: Reserva = {

            nombreCliente: this.usuario.nombre,
            deporte: this.deporteNombre,

            //Campos para hacer la reserva en bdd
            idCliente: this.usuario.id_usuario,
            idPista: recinto.id,
            idHorario: horario.id,
            fecha: fechaFormateada,
          }

          this._apiReservas.hacerReserva(reserva, this.usuario).pipe(
            tap((response => {

              console.log(response)

              if (response.status === 'exito')
                this._dialogMensaje.abrirDialogoConfirmacion(`Se ha realizado su reserva correctamente ${this.usuario.nombre}`, true);
              this.cargarReservas();

            }))
          ).subscribe();

          console.log(`Se ha clicado la pista: ${recinto.nombre} id:${recinto.id} , con horario ${horario.id}`);
        }
      });
    }

  }

  //Evento para el cambio de fecha.. y hacer la petición
  public cambioFecha(event: MatDatepickerInputEvent<Date>) {

    const fechaSelec = event.value
    if (fechaSelec) {
      this.fechaReserva = fechaSelec
      console.log(this.fechaReserva)
      this.cargarReservas();
    }

  }

  public handleClickAtras(event: Event): void {
    event.stopPropagation();
    this.location.back();
  }
}