import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatTableModule } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { Location } from '@angular/common';
import { ReservaEstadoDirective } from './reserva-estado.directive';
import { ReservasService } from './reservas.service';
import { tap } from 'rxjs';
import { Pista } from './pista.interface';
import { Reserva } from './reserva.interface';
import { Horario } from './horario.interface';

@Component({
  selector: 'app-reservar-deporte',
  standalone: true,
  imports: [
    MatTableModule,
    ReservaEstadoDirective,
    MatButtonModule,
    MatCardModule,
    MatExpansionModule,
    MatDividerModule,
    MatGridListModule,
    CommonModule
  ],
  templateUrl: './reservar-deporte.component.html',
  styleUrls: ['./reservar-deporte.component.scss']
})
export class ReservarDeporteComponent implements OnInit {
  //Id del deporte reservado...
  public deporteId!: number;

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

  public fechaHoy: Date = new Date();

  public reservas: any = [

  ];

  public reservasCargadas: boolean = false;

  constructor(
    private ruta: ActivatedRoute,
    private location: Location,
    private readonly _apiReservas: ReservasService) { }

  ngOnInit(): void {
    const deporteId = this.ruta.snapshot.paramMap.get('id');
    this.deporteId = deporteId ? +deporteId : 0;

    console.log('id deporte: ', this.deporteId)


    this.cargarHorario();
    this.cargarPistas();
    this.cargarReservas()


  }

  //Método que se encarga de cargar todas las reservas que hay en la bdd..
  public cargarReservas(): void {
    this._apiReservas.getReservas(this.deporteId).pipe(
      tap((reservas: Reserva[]) => {
        this.reservas = reservas.map(reserva => ({
          id: reserva.id,
          idPista: reserva.idPista,
          rangoHoras: {
            inicio: reserva.inicio.slice(0, 5) ,
            fin: reserva.fin.slice(0, 5) 
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
    console.log(`Se ha clicado la pista: ${recinto.nombre} id:${recinto.id} , con horario ${horario.id}`);
  }

  public handleClickAtras(event: Event): void {
    event.stopPropagation();
    this.location.back();
  }
}