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

export interface Reserva {

  id?: number;
  idCliente: number;
  idPista: number;
  idHorario: number;
  idDeporte: number;
  fecha: string;
}








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
  public deporteId!: number;
  public times: string[] = [
    '08:00 - 09:00', '09:00 - 10:00', '10:00 - 11:00',
    '11:00 - 12:00', '12:00 - 13:00', '13:00 - 14:00'
  ];
  public recintos: string[] = ['Pista 1', 'Pista 2', 'Pista 3', 'Pista 4', 'Pista 5', 'Pista 6'];

  //Propiedad para almacenar el estado de las reservas.
  public reservasEstado: { [key: string]: boolean } = {}

  public fechaHoy: Date = new Date();

  public reservas: any = [
    { id: 1458555, idPista: 1, rangoHoras: { inicio: '09:00', fin: '10:00' }, pistaCubierta: true },
    { id: 4555453, idPista: 2, rangoHoras: { inicio: '09:00', fin: '10:00' }, pistaCubierta: false },
    { id: 9837234, idPista: 3, rangoHoras: { inicio: '09:00', fin: '10:00' }, pistaCubierta: false },
    { id: 4523445, idPista: 1, rangoHoras: { inicio: '10:00', fin: '11:00' }, pistaCubierta: true },
    { id: 2355235, idPista: 1, rangoHoras: { inicio: '13:00', fin: '14:00' }, pistaCubierta: true },
    { id: 2345234, idPista: 4, rangoHoras: { inicio: '09:00', fin: '10:00' }, pistaCubierta: false },
    { id: 2345452, idPista: 2, rangoHoras: { inicio: '10:00', fin: '11:00' }, pistaCubierta: false },
    { id: 2345523, idPista: 4, rangoHoras: { inicio: '13:00', fin: '14:00' }, pistaCubierta: false },
    { id: 2345222, idPista: 5, rangoHoras: { inicio: '13:00', fin: '14:00' }, pistaCubierta: true },
    { id: 5523452, idPista: 3, rangoHoras: { inicio: '12:00', fin: '13:00' }, pistaCubierta: false },
  ];

  public reservasBdd: any [] = [];

  constructor(
    private ruta: ActivatedRoute,
    private location: Location,
    private readonly _apiReservas: ReservasService) { }

  ngOnInit(): void {
    const deporteId = this.ruta.snapshot.paramMap.get('id');
    this.deporteId = deporteId ? +deporteId : 0;
    console.log('Deporte seleccionado: ', this.deporteId);

    console.log('Dia de hoy: ', this.fechaHoy)
    this.cargarReservas()
    console.log(this.reservasBdd)
  }

  //Método que se encarga de cargar todas las reservas que hay en la bdd..
  public cargarReservas(): void {
    this._apiReservas.getReservas(this.deporteId).pipe(
      tap((reservas) => {
        // Verificamos qué llega en reservas antes de mapear
        console.log('Reservas desde el backend:', reservas);
  
        this.reservasBdd = reservas.map(reserva => ({
          id: reserva.id,
          idPista: reserva.idPista,
          rangoHoras: {
            inicio: reserva.horario_inicio.slice(0, 5), // Tomamos solo las horas y minutos
            fin: reserva.horario_fin.slice(0, 5)        // Tomamos solo las horas y minutos
          }
        }));
  
        // Verificamos el estado de reservasBdd después de mapear
        console.log('Reservas mapeadas:', this.reservasBdd);
      })
    ).subscribe({
        next: () => {
          // Aquí se puede asegurar que el dato ya está listo
          console.log('Carga de reservas completada.');
        },
        error: (err) => {
          console.error('Error al cargar las reservas:', err);
        }
    });
  }


  public getReserva(time: string, recinto: string): boolean {
    const idPista = parseInt(recinto.split(' ')[1]);
    const reservaEncontrada = this.reservas.find(
      (r: any) => r.idPista === idPista && this.estaDentroDelRango(time, r.rangoHoras.inicio, r.rangoHoras.fin)
    );
    return !!reservaEncontrada;
  }

  private estaDentroDelRango(time: string, inicio: string, fin: string): boolean {
    return time >= inicio && time < fin;
  }

  public reserva(time: string, recinto: string, ocupado: boolean): void {
    if (ocupado) {
      console.log('Esa pista no está disponible...');
      return;
    }
    console.log(`Se ha clicado la pista: ${recinto} con fecha: ${time}`);
  }

  public handleClickAtras(event: Event): void {
    event.stopPropagation();
    this.location.back();
  }
}
