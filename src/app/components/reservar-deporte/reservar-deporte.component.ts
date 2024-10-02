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

@Component({
  selector: 'app-reservar-deporte',
  standalone: true,
  imports: [MatTableModule, MatButtonModule, MatCardModule, MatExpansionModule, MatDividerModule, MatGridListModule, CommonModule],
  templateUrl: './reservar-deporte.component.html',
  styleUrl: './reservar-deporte.component.scss'
})
export class ReservarDeporteComponent implements OnInit {

  public deporteId!: number;

  //Horarios de las pistas
  public times: string[] = ['08:00 - 09:00', '09:00 - 10:00', '10:00 - 11:00', '11:00 - 12:00', '12:00 - 13:00', '13:00 - 14:00'];

  //Las pistas que hay para ese deporte
  public recintos: string[] = ['Pista 1', 'Pista 2', 'Pista 3', 'Pista 4', 'Pista 5', 'Pista 6'];

  //Todas las reservas que se han hecho para ese día...
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

  constructor(private ruta: ActivatedRoute, private location: Location) { }

  ngOnInit(): void {

    const deporteId = this.ruta.snapshot.paramMap.get('id');
    // Asigna 0 si el deporteId es null
    this.deporteId = deporteId ? +deporteId : 0;
    console.log('Deporte seleccionado: ', this.deporteId);

    console.log('--- Reservas ---')
    console.log(this.reservas)
  }

  public getReserva(time: string, recinto: string): boolean {
    // Convierte el recinto en un número (p.ej., 'Pista 1' a 1)
    const idPista = parseInt(recinto.split(' ')[1]);

    // Filtra la reserva que coincida con la pista y el horario dentro del rango
    const reservaEncontrada = this.reservas.find(
      (r: any) => r.idPista === idPista && this.estaDentroDelRango(time, r.rangoHoras.inicio, r.rangoHoras.fin)
    );

    // Si existe una reserva en ese horario para esa pista, está ocupada
    return reservaEncontrada;
  }

  private estaDentroDelRango(time: string, inicio: string, fin: string): boolean {
    // Compara el horario `time` con el rango de horas (inicio y fin)
    return time >= inicio && time < fin; // Comprobamos si `time` está dentro del rango
  }

  ///Función que se enccarga de realizar la reserva
  public reserva(time: string, recinto: string, ocupado: boolean) {


    //Antes de todo nos aseguramos de que la casilla que hemos clicado no está ocupada
    if(ocupado){
      console.log('Esa pista no está disponible...')
      return;
    }
    //Ya que nos hemos asegurado que el asiento no está ocupado podemos hacer la reserva.
    console.log(`Se ha clicado la pista: ${recinto} con fecha: ${time}`)
  }

  public handleClickAtras(event: Event) {

    event.stopPropagation()
    this.location.back();
  }


}
