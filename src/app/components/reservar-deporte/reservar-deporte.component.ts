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
import { Horario } from './horario.interface';
import { Reserva } from './reserva.interface';

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

  public horarios: { idPista: number, inicio: string, fin: string }[] = [];
  public horariosOcupados: { [key: string]: boolean } = {};

  public pistas: {id:number, nombre:string}[] = [];

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


    this.cargarPistas();
    this.cargarHorario();
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
            inicio: reserva.inicio.slice(0, 5),
            fin: reserva.fin.slice(0, 5)
          }
        }));
        console.log('Datos de reservas cargadas:', this.reservas);
      })
    ).subscribe({
      next: () => {
        console.log('Carga de reservas completada.');
        this.reservasCargadas = true;
        this.verificarOcupacion();
      },
      error: (err) => {
        console.error('Error al cargar las reservas:', err);
      }
    });
  }

  public verificarOcupacion(): void {
    this.horarios.forEach(horario => {
      const ocupado = this.reservas.some((reserva: { rangoHoras: { inicio: string; fin: string; }; }) => 
        reserva.rangoHoras.inicio === horario.inicio && 
        reserva.rangoHoras.fin === horario.fin
      );
      // Aquí puedes añadir lógica para marcar el horario como ocupado o libre
    });
  }

  public cargarPistas(): void {

    const pistasArray: string[] = [];
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
        this.horarios = horarios.map(h => ({
          idPista: h.idPista,
          inicio: h.inicio.slice(0, 5),
          fin: h.fin.slice(0, 5)
        }));
  
        console.log('Horarios cargados:', this.horarios);
        console.log('Reservas:', this.reservas);
  
        // Llenar solo los horarios ocupados si coinciden con reservas
        this.horarios.forEach(horario => {
          const ocupado = this.reservas.some((reserva: { idPista: number; rangoHoras: { inicio: string; fin: string; }; }) =>
            reserva.idPista === horario.idPista &&
            reserva.rangoHoras.inicio === horario.inicio &&
            reserva.rangoHoras.fin === horario.fin
          );
  
          console.log(`Horario: ${horario.inicio}-${horario.fin} Pista: ${horario.idPista} Ocupado: ${ocupado}`);
  
          if (ocupado) {
            const key = `${horario.inicio}-${horario.idPista}`;
            this.horariosOcupados[key] = true;
          }
        });
  
        console.log('Horarios ocupados:', this.horariosOcupados);
      })
    ).subscribe();
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

  public reserva(time: string, recinto: { id: number, nombre: string }, ocupado: boolean): void {
    if (ocupado) {
      console.log('Esa pista no está disponible...');
      return;
    }
    console.log(`Se ha clicado la pista: ${recinto.nombre} con fecha: ${time}`);
  }

  public handleClickAtras(event: Event): void {
    event.stopPropagation();
    this.location.back();
  }
}
